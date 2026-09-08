<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'teacher_id',
        'subject_id',
        'grade_level',
        'track',
        'description',
        'short_description',
        'banner_image_url',
        'price',
        'original_price',
        'start_date',
        'start_time',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'start_date' => 'date',
            'is_published' => 'boolean',
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order_index');
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'user_id');
    }

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'package_course');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeForPathway($query, ?string $gradeLevel, ?string $track)
    {
        if ($gradeLevel) {
            $query->where('grade_level', $gradeLevel);
        }
        if ($track) {
            $query->where('track', $track);
        }
        return $query;
    }
}
