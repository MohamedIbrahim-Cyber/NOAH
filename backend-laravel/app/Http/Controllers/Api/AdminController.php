<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCourseRequest;
use App\Http\Requests\CreateExamRequest;
use App\Http\Requests\CreateLessonRequest;
use App\Models\Course;
use App\Models\Exam;
use App\Models\Lesson;
use App\Models\Order;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Admin: Create Course
     */
    public function createCourse(CreateCourseRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $slug = Str::slug($validated['title']) . '-' . Str::random(4);

        $course = Course::create(array_merge($validated, [
            'slug' => $slug,
            'is_published' => true,
        ]));

        return response()->json([
            'message' => 'تم إنشاء المساق التعليمي بنجاح.',
            'course' => $course,
        ], 201);
    }

    /**
     * Admin: Create Lesson
     */
    public function createLesson(CreateLessonRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $lesson = Lesson::create($validated);

        return response()->json([
            'message' => 'تمت إضافة المحاضرة/الدرس بنجاح.',
            'lesson' => $lesson,
        ], 201);
    }

    /**
     * Admin: Create Exam
     */
    public function createExam(CreateExamRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $exam = Exam::create([
            'course_id' => $validated['course_id'],
            'title' => $validated['title'],
            'duration_minutes' => $validated['duration_minutes'],
            'is_final' => $validated['is_final'] ?? false,
        ]);

        if (!empty($validated['questions'])) {
            foreach ($validated['questions'] as $q) {
                $exam->questions()->create([
                    'question_text' => $q['question_text'],
                    'choices' => $q['choices'],
                    'correct_choice_index' => $q['correct_choice_index'],
                    'explanation' => $q['explanation'] ?? null,
                ]);
            }
        }

        return response()->json([
            'message' => 'تم إنشاء الاختبار بنجاح.',
            'exam' => $exam->load('questions'),
        ], 201);
    }

    /**
     * Admin: Get all Orders with User and Item details
     */
    public function orders(Request $request): JsonResponse
    {
        $orders = Order::with('user:id,full_name,email,phone')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'orders' => $orders,
        ]);
    }

    /**
     * Admin: Get all Support Tickets
     */
    public function supportTickets(Request $request): JsonResponse
    {
        $tickets = SupportTicket::with('user:id,full_name,phone')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'tickets' => $tickets,
        ]);
    }

    /**
     * Admin: Update Support Ticket Status
     */
    public function updateTicketStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:open,answered,closed'],
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update([
            'status' => $validated['status'],
            'assigned_to' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'تم تحديث حالة التذكرة بنجاح.',
            'ticket' => $ticket,
        ]);
    }
}
