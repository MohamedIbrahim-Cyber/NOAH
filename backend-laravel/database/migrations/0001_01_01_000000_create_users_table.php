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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('phone')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('password'); // Strictly hashed via Hash::make() (bcrypt)
            $table->enum('role', ['student', 'teacher', 'admin', 'support'])->default('student');
            $table->enum('grade_level', ['1st_secondary', '2nd_secondary', '3rd_secondary'])->default('3rd_secondary');
            $table->enum('track', [
                'shared_year',
                'natural_sciences',
                'computing_engineering',
                'business_admin',
                'sharia_islamic_studies',
            ])->default('computing_engineering');
            $table->rememberToken();
            $table->timestamps();

            $table->index(['role', 'grade_level', 'track']);
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
