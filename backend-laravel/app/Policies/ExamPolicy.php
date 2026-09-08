<?php

namespace App\Policies;

use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\User;

class ExamPolicy
{
    /**
     * Determine whether the user can take or view the exam.
     */
    public function take(User $user, Exam $exam): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return Enrollment::where('user_id', $user->id)
            ->where('course_id', $exam->course_id)
            ->exists();
    }
}
