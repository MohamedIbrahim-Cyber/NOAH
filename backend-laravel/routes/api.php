<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Nohe Academy - API Routes
|--------------------------------------------------------------------------
| Designed for the Next.js / React frontend consuming Laravel 11 as an API
| with Sanctum authentication, strictly hashed passwords, rate limiting,
| server-side exam evaluation, and Moyasar payment webhooks.
|--------------------------------------------------------------------------
*/

// ==========================================
// 1. Authentication Flows (Fortify + Sanctum)
// ==========================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:3,1');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function (\Illuminate\Http\Request $request) {
        return response()->json(['user' => $request->user()]);
    });
});

// ==========================================
// 2. Public Educational Catalog
// ==========================================
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{slug}', [CourseController::class, 'show']);
Route::get('/packages', [CourseController::class, 'packages']);
Route::get('/teachers', [CourseController::class, 'teachers']);

// ==========================================
// 3. Payments & Webhooks (Throttled webhook endpoint)
// ==========================================
Route::post('/webhooks/payment', [WebhookController::class, 'handleMoyasar'])->middleware('throttle:60,1');

// ==========================================
// 4. Protected Student Routes (auth:sanctum)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    // Student Dashboard Progress
    Route::get('/dashboard/progress', [DashboardController::class, 'progress']);
    Route::get('/dashboard/progress-reports/{id}', [DashboardController::class, 'showReport']);

    // Video Token (Enforces LessonPolicy)
    Route::get('/lessons/{id}/video-token', [LessonController::class, 'videoToken']);

    // Exams (Question fetch & strictly server-side grading with rate-limiting)
    Route::get('/exams/{id}', [ExamController::class, 'show']);
    Route::post('/exams/{id}/submit', [ExamController::class, 'submit'])->middleware('throttle:5,1');
    Route::get('/exam-attempts/{id}', [ExamController::class, 'showAttempt']);

    // Checkout & Orders with IDOR protection
    Route::post('/checkout/create', [CheckoutController::class, 'createOrder'])->middleware('throttle:10,1');
    Route::get('/orders', [CheckoutController::class, 'orders']);
    Route::get('/orders/{id}', [CheckoutController::class, 'showOrder']);
});

// ==========================================
// 5. Protected Admin Routes (auth:sanctum + role:admin)
// ==========================================
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::post('/courses', [AdminController::class, 'createCourse']);
    Route::post('/lessons', [AdminController::class, 'createLesson']);
    Route::post('/exams', [AdminController::class, 'createExam']);
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::get('/support-tickets', [AdminController::class, 'supportTickets']);
    Route::patch('/support-tickets/{id}', [AdminController::class, 'updateTicketStatus']);
});
