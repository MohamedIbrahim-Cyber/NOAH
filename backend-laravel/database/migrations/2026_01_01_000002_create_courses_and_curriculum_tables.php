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
        // Teachers
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('display_name');
            $table->string('subject');
            $table->text('bio')->nullable();
            $table->string('photo_url')->nullable();
            $table->string('banner_color_theme')->default('fresh');
            $table->timestamps();
        });

        // Subjects
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // Courses
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->enum('grade_level', ['1st_secondary', '2nd_secondary', '3rd_secondary']);
            $table->enum('track', [
                'shared_year',
                'natural_sciences',
                'computing_engineering',
                'business_admin',
                'sharia_islamic_studies',
            ]);
            $table->text('description');
            $table->string('short_description', 500)->nullable();
            $table->string('banner_image_url')->nullable();
            $table->decimal('price', 8, 2); // In Saudi Riyals (SAR)
            $table->decimal('original_price', 8, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->time('start_time')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['grade_level', 'track', 'is_published']);
        });

        // Lessons
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('title');
            $table->unsignedInteger('order_index')->default(1);
            $table->string('video_provider_id'); // Bunny.net or Cloudflare Stream video GUID (never a public URL)
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->boolean('is_preview')->default(false);
            $table->json('attachment_urls')->nullable(); // PDF notes, worksheets
            $table->timestamps();

            $table->index(['course_id', 'order_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('teachers');
    }
};
