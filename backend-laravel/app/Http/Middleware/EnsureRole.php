<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request and ensure the user possesses the required role.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'غير مصرح لك. يرجى تسجيل الدخول أولاً.',
                'code' => 'AUTH_REQUIRED',
            ], 401);
        }

        if (!in_array($user->role, $roles, true)) {
            return response()->json([
                'error' => 'عذراً، هذه الصلاحية مقتصرة على مشرفي النظام أو المعلمين فقط.',
                'code' => 'FORBIDDEN_ROLE',
            ], 403);
        }

        return $next($request);
    }
}
