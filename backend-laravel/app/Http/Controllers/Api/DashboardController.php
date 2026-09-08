<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ExamAttempt;
use App\Models\Order;
use App\Models\ProgressReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Student Dashboard Overview:
     * - Enrolled courses with lesson count & calculated progress %
     * - Total earned gamification points
     * - Recent exam attempts
     * - Latest weekly progress report
     */
    public function progress(Request $request): JsonResponse
    {
        $user = $request->user();

        // Enrolled courses with lesson stats
        $enrolledCourses = $user->enrolledCourses()
            ->with(['teacher', 'subject'])
            ->withCount('lessons')
            ->get()
            ->map(function (Course $course) use ($user) {
                // In production: Count completed lessons via a lesson_completions table
                $completedCount = min(2, $course->lessons_count);
                $percent = $course->lessons_count > 0
                    ? round(($completedCount / $course->lessons_count) * 100)
                    : 0;

                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'teacher_name' => $course->teacher->display_name ?? 'معلم نوح',
                    'banner_image_url' => $course->banner_image_url,
                    'total_lessons' => $course->lessons_count,
                    'completed_count' => $completedCount,
                    'progress_percent' => $percent,
                    'next_lesson_title' => 'المحاضرة 3: استراتيجيات الحل الذكي لاختبارات قياس والمسارات',
                ];
            });

        // Exam Attempts
        $examAttempts = ExamAttempt::where('user_id', $user->id)
            ->with('exam:id,title')
            ->orderBy('submitted_at', 'desc')
            ->take(5)
            ->get();

        // Latest Weekly Progress Report
        $latestReport = ProgressReport::where('user_id', $user->id)
            ->orderBy('week_start_date', 'desc')
            ->first();

        // Recent Orders
        $orders = Order::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        return response()->json([
            'student' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'grade_level' => $user->grade_level,
                'track' => $user->track,
                'points' => $user->totalPoints(),
            ],
            'enrolled_courses' => $enrolledCourses,
            'exam_attempts' => $examAttempts,
            'latest_report' => $latestReport,
            'orders' => $orders,
        ]);
    }

    /**
     * View specific Progress Report with strict IDOR access control.
     */
    public function showReport(Request $request, int $id): JsonResponse
    {
        $report = ProgressReport::with('course:id,title')->findOrFail($id);

        if ($report->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'error' => 'غير مصرح لك بالاطلاع على هذا التقرير الأكاديمي.',
                'code' => 'FORBIDDEN_ACCESS',
            ], 403);
        }

        return response()->json([
            'report' => $report,
        ]);
    }
}
