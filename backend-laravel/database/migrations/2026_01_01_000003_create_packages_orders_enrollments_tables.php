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
        // Packages (term, full_year, combo)
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['term', 'full_year', 'combo'])->default('term');
            $table->text('description')->nullable();
            $table->string('banner_image_url')->nullable();
            $table->decimal('price', 8, 2); // SAR
            $table->decimal('original_price', 8, 2)->nullable();
            $table->timestamps();
        });

        // Package Courses Pivot
        Schema::create('package_course', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained('packages')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->unique(['package_id', 'course_id']);
        });

        // Orders (Moyasar / HyperPay in SAR)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('item_type', ['course', 'package']);
            $table->unsignedBigInteger('item_id');
            $table->decimal('amount', 8, 2); // SAR
            $table->enum('payment_provider', ['moyasar', 'hyperpay'])->default('moyasar');
            $table->enum('payment_method', ['mada', 'stc_pay', 'sarie', 'card', 'apple_pay'])->default('mada');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->string('provider_transaction_id')->nullable()->index();
            $table->timestamps();

            $table->index(['user_id', 'payment_status']);
        });

        // Enrollments
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->timestamp('enrolled_at')->useCurrent();
            $table->timestamp('expires_at')->nullable(); // Term expiry or null for lifetime term
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('package_course');
        Schema::dropIfExists('packages');
    }
};
