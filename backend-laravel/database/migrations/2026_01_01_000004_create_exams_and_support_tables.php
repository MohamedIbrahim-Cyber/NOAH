<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Questions Bank
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->nullOnDelete();
            $table->text('question_text');
            $table->json('choices'); // Array of strings: ['Option 1', 'Option 2', ...]
            $table->unsignedSmallInteger('correct_choice_index'); // 0-based index
            $table->text('explanation')->nullable();
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->timestamps();
        });

        // Exams
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('title');
            $table->unsignedInteger('duration_minutes')->default(20);
            $table->boolean('is_final')->default(false);
            $table->timestamps();
        });

        // Exam Question Pivot
        Schema::create('exam_question', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions')->cascadeOnDelete();
            $table->unsignedInteger('order_index')->default(1);
            $table->unique(['exam_id', 'question_id']);
        });

        // Exam Attempts
        Schema::create('exam_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('started_at');
            $table->timestamp('submitted_at')->nullable();
            $table->unsignedSmallInteger('score')->default(0); // Strictly calculated server-side
            $table->json('answers')->nullable(); // { "question_id": choice_index }
            $table->timestamps();

            $table->index(['user_id', 'exam_id']);
        });

        // Weekly Progress Reports
        Schema::create('progress_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->date('week_start_date');
            $table->text('summary_text');
            $table->timestamp('generated_at')->useCurrent();
            $table->timestamps();
        });

        // Support Tickets
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('channel', ['whatsapp', 'telegram', 'in_app'])->default('in_app');
            $table->text('message');
            $table->enum('status', ['open', 'answered', 'closed'])->default('open');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status', 'channel']);
        });

        // Student Rewards (Gamification points)
        Schema::create('rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('points'); // Positive for reward, negative for redemption
            $table->string('reason');
            $table->timestamps();

            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rewards');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('progress_reports');
        Schema::dropIfExists('exam_attempts');
        Schema::dropIfExists('exam_question');
        Schema::dropIfExists('exams');
        Schema::dropIfExists('questions');
    }
};
