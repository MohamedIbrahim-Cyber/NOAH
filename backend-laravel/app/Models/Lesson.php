<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'order_index',
        'video_provider_id',
        'duration_seconds',
        'is_preview',
        'attachment_urls',
    ];

    protected function casts(): array
    {
        return [
            'order_index' => 'integer',
            'duration_seconds' => 'integer',
            'is_preview' => 'boolean',
            'attachment_urls' => 'array',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
