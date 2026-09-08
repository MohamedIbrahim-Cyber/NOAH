<?php

namespace App\Policies;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\User;

class LessonPolicy
{
    /**
     * Determine whether the user can view the lesson video and content.
     */
    public function view(User $user, Lesson $lesson): bool
    {
        // Preview lessons are free to watch for all authenticated users
        if ($lesson->is_preview) {
            return true;
        }

        // Admins and teachers of the course can always view
        if ($user->isAdmin()) {
            return true;
        }

        // Check active enrollment in the course
        return Enrollment::where('user_id', $user->id)
            ->where('course_id', $lesson->course_id)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->exists();
    }
}
