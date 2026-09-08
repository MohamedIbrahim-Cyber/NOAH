<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\Reward;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Flow 1: Registration with Bcrypt Password Hashing & 100 Welcome Points.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            // Strictly hash password using Bcrypt
            $user = new User([
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'email' => strtolower($validated['email']),
                'password' => Hash::make($validated['password']),
                'grade_level' => $validated['grade_level'],
                'track' => $validated['track'],
            ]);
            // Strictly assign student role (cannot be overridden by mass assignment)
            $user->role = 'student';
            $user->save();

            // Welcome Gamification Points
            Reward::create([
                'user_id' => $user->id,
                'points' => 100,
                'reason' => 'مكافأة الترحيب والانضمام إلى منصة نوح التعليمية',
            ]);

            // Issue Sanctum Token (Lifetime 1440 mins)
            $token = $user->createToken('nohe_auth_token', ['*'], now()->addMinutes(1440))->plainTextToken;

            return response()->json([
                'message' => 'تم إنشاء الحساب بنجاح وتم منحك 100 نقطة ترحيبية!',
                'user' => $user,
                'token' => $token,
            ], 201);
        });
    }

    /**
     * Flow 2: Login with 5-attempt Rate Limiter & Temporary Lockout.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $identifier = $validated['identifier'];
        $throttleKey = Str::transliterate(Str::lower($identifier) . '|' . $request->ip());

        // Check if user is locked out due to repeated failed attempts
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'error' => "تم حظر محاولات الدخول مؤقتاً بسبب تكرار كلمة المرور الخاطئة. يرجى المحاولة بعد {$seconds} ثانية.",
                'code' => 'THROTTLED',
                'retry_after' => $seconds,
            ], 429);
        }

        // Find user by email or phone
        $user = User::where('email', strtolower($identifier))
            ->orWhere('phone', $identifier)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            // Increment rate limiter counter (locks for 60 seconds after 5 failed attempts)
            RateLimiter::hit($throttleKey, 60);

            $remaining = RateLimiter::remaining($throttleKey, 5);

            return response()->json([
                'error' => "بيانات الدخول غير صحيحة. المحاولات المتبقية قبل القفل المؤقت: {$remaining}",
                'code' => 'INVALID_CREDENTIALS',
                'attempts_remaining' => $remaining,
            ], 401);
        }

        // Successful authentication: clear rate limiter
        RateLimiter::clear($throttleKey);

        // Issue new Sanctum token
        $token = $user->createToken('nohe_auth_token', ['*'], now()->addMinutes(1440))->plainTextToken;

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Flow 3: Logout - Invalidate session / delete Sanctum token server-side.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            // Delete the current access token from the database
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح وإلغاء صلاحية الرمز المميز.',
        ]);
    }

    /**
     * Flow 4a: Forgot Password - Generates signed expiring reset token.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $email = $request->validated()['email'];

        $user = User::where('email', strtolower($email))
            ->orWhere('phone', $email)
            ->first();

        if (!$user) {
            // Return success even if not found to prevent user enumeration
            return response()->json([
                'message' => 'إذا كان الحساب مسجلاً لدينا، فستصلك رسالة تحتوي على رابط وتصريح استعادة كلمة المرور.',
            ]);
        }

        // Generate secure random reset token
        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'تم إرسال رابط وتصريح إعادة التعيين إلى بريدك الإلكتروني وهاتفك المسجل.',
            'reset_token' => config('app.debug') ? $token : null, // visible in debug for easy testing
        ]);
    }

    /**
     * Flow 4b: Reset Password - Validates token & hashes new password.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $email = strtolower($validated['email']);
        $token = $validated['token'];
        $newPassword = $validated['password'];

        $record = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->first();

        if (!$record || !Hash::check($token, $record->token)) {
            return response()->json([
                'error' => 'رمز استعادة كلمة المرور غير صالح أو منتهي الصلاحية.',
                'code' => 'INVALID_TOKEN',
            ], 400);
        }

        // Check 60 minutes expiry
        if (now()->subMinutes(60)->gt($record->created_at)) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return response()->json([
                'error' => 'انتهت صلاحية رابط استعادة كلمة المرور. يرجى طلب رابط جديد.',
                'code' => 'EXPIRED_TOKEN',
            ], 400);
        }

        // Update password with Hash::make()
        $user = User::where('email', $email)->first();
        if ($user) {
            $user->forceFill([
                'password' => Hash::make($newPassword),
            ])->save();

            // Revoke existing tokens for security
            $user->tokens()->delete();

            // Delete password reset token record
            DB::table('password_reset_tokens')->where('email', $email)->delete();
        }

        return response()->json([
            'message' => 'تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.',
        ]);
    }
}
