<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Package;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Public Catalog: List courses with optional filters (grade_level, track, search).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Course::published()
            ->with(['teacher', 'subject'])
            ->withCount('lessons');

        if ($request->filled('grade_level')) {
            $query->where('grade_level', $request->grade_level);
        }

        if ($request->filled('track')) {
            $query->where('track', $request->track);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $courses = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'courses' => $courses,
            'total' => $courses->count(),
        ]);
    }

    /**
     * Public Course Page by Slug.
     */
    public function show(string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)
            ->with([
                'teacher',
                'subject',
                'lessons' => function ($q) {
                    $q->select([
                        'id',
                        'course_id',
                        'title',
                        'order_index',
                        'duration_seconds',
                        'is_preview',
                        // video_provider_id is purposefully hidden on public view!
                    ]);
                },
                'exams' => function ($q) {
                    $q->select(['id', 'course_id', 'title', 'duration_minutes']);
                },
            ])
            ->firstOrFail();

        return response()->json([
            'course' => $course,
        ]);
    }

    /**
     * Public Packages list.
     */
    public function packages(): JsonResponse
    {
        $packages = Package::with('courses')->get();

        return response()->json([
            'packages' => $packages,
        ]);
    }

    /**
     * Public Teachers list.
     */
    public function teachers(): JsonResponse
    {
        $teachers = Teacher::withCount('courses')->get();

        return response()->json([
            'teachers' => $teachers,
        ]);
    }
}
