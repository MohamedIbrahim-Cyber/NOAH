<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitExamRequest;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Reward;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ExamController extends Controller
{
    /**
     * Get exam metadata and questions (without correct choices exposed!).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $exam = Exam::with(['course'])->findOrFail($id);

        // Authorization: User must be enrolled in course or be admin
        Gate::authorize('take', $exam);

        // Fetch questions without exposing correct_choice_index
        $questions = $exam->questions()
            ->select(['questions.id', 'questions.question_text', 'questions.choices', 'questions.difficulty'])
            ->get();

        return response()->json([
            'exam' => [
                'id' => $exam->id,
                'course_id' => $exam->course_id,
                'title' => $exam->title,
                'duration_minutes' => $exam->duration_minutes,
                'questions' => $questions,
            ],
        ]);
    }

    /**
     * Submit Exam Answers - STRICTLY SERVER-SIDE GRADING.
     * Never trusts any client score.
     */
    public function submit(SubmitExamRequest $request, int $id): JsonResponse
    {
        $exam = Exam::with('questions')->findOrFail($id);
        $user = $request->user();

        Gate::authorize('take', $exam);

        $answers = $request->validated()['answers'] ?? []; // [question_id => selected_index]

        $score = 0;
        $total = $exam->questions->count();
        $breakdown = [];

        // Grade on server against verified correct_choice_index
        foreach ($exam->questions as $question) {
            $chosenIndex = $answers[$question->id] ?? null;
            $isCorrect = ($chosenIndex !== null && (int)$chosenIndex === (int)$question->correct_choice_index);

            if ($isCorrect) {
                $score++;
            }

            $breakdown[] = [
                'question_id' => $question->id,
                'text' => $question->question_text,
                'choices' => $question->choices,
                'chosen_index' => $chosenIndex !== null ? (int)$chosenIndex : null,
                'correct_index' => (int)$question->correct_choice_index,
                'is_correct' => $isCorrect,
                'explanation' => $question->explanation,
            ];
        }

        $percentage = $total > 0 ? round(($score / $total) * 100) : 0;
        $earnedPoints = $score * 15; // 15 gamification points per correct answer

        DB::transaction(function () use ($exam, $user, $score, $answers, $earnedPoints) {
            // Save attempt
            ExamAttempt::create([
                'exam_id' => $exam->id,
                'user_id' => $user->id,
                'started_at' => now()->subMinutes($exam->duration_minutes),
                'submitted_at' => now(),
                'score' => $score,
                'answers' => $answers,
            ]);

            // Add rewards
            if ($earnedPoints > 0) {
                Reward::create([
                    'user_id' => $user->id,
                    'points' => $earnedPoints,
                    'reason' => "اجتياز اختبار: {$exam->title} بنتيجة {$score} من {$exam->questions->count()}",
                ]);
            }
        });

        return response()->json([
            'message' => 'تم استلام وتصحيح الاختبار بنجاح.',
            'score' => $score,
            'total' => $total,
            'percentage' => $percentage,
            'earned_points' => $earnedPoints,
            'feedback' => $percentage >= 80
                ? 'أداء استثنائي ومتقن لمفاهيم مسارات الثانوية العامة! 🌟'
                : 'محاولة جيدة، راجع الإجابات النموذجية لتعزيز فهمك.',
            'breakdown' => $breakdown,
        ]);
    }

    /**
     * Get single exam attempt with strict IDOR prevention.
     */
    public function showAttempt(Request $request, int $attemptId): JsonResponse
    {
        $attempt = ExamAttempt::with('exam:id,title,course_id')->findOrFail($attemptId);

        // Broken Access Control check: only owner or admin can view attempt
        if ($attempt->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'error' => 'غير مصرح لك بالاطلاع على نتيجة طالب آخر.',
                'code' => 'FORBIDDEN_ACCESS',
            ], 403);
        }

        return response()->json([
            'attempt' => $attempt,
        ]);
    }
}
