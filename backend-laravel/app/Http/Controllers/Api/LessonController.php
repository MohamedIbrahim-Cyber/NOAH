<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LessonController extends Controller
{
    /**
     * Protected Video Token Endpoint:
     * Enforces LessonPolicy (checks enrollment or is_preview).
     * Returns signed Bunny.net Stream / Cloudflare Stream token.
     */
    public function videoToken(Request $request, int $id): JsonResponse
    {
        $lesson = Lesson::with('course')->findOrFail($id);
        $user = $request->user();

        // ⚠️ Enforce LessonPolicy authorization check!
        Gate::authorize('view', $lesson);

        $libraryId = config('services.bunny.library_id', env('BUNNY_STREAM_LIBRARY_ID', '312847'));
        $tokenKey = config('services.bunny.token_key', env('BUNNY_STREAM_TOKEN_AUTH_KEY', 'nohe_secret_token_key_2026'));
        $videoGuid = $lesson->video_provider_id;

        // Token expiry: 3 hours from now
        $expires = time() + (3 * 3600);

        // Bunny.net Stream Token Authentication: SHA256(token_key + video_id + expires)
        $hashable = $tokenKey . $videoGuid . $expires;
        $signature = hash('sha256', $hashable);

        // CDN playback URL
        $cdnHost = env('BUNNY_STREAM_CDN_HOSTNAME', 'iframe.mediadelivery.net');
        $playbackUrl = "https://{$cdnHost}/play/{$libraryId}/{$videoGuid}?token={$signature}&expires={$expires}";

        return response()->json([
            'lesson_id' => $lesson->id,
            'title' => $lesson->title,
            'is_preview' => $lesson->is_preview,
            'duration_seconds' => $lesson->duration_seconds,
            'attachments' => $lesson->attachment_urls,
            'stream' => [
                'provider' => 'bunny_stream',
                'video_id' => $videoGuid,
                'signed_url' => $playbackUrl,
                'token' => $signature,
                'expires_at' => $expires,
            ],
            // Watermark student info on video player to prevent screen recording leak
            'watermark' => [
                'student_name' => $user->full_name,
                'student_phone' => substr($user->phone, 0, 4) . '****' . substr($user->phone, -3),
                'session_id' => substr(md5($user->id . $expires), 0, 8),
            ],
        ]);
    }
}
