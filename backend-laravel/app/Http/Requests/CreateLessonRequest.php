<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateLessonRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'course_id' => ['required', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'video_provider_id' => ['required', 'string'],
            'duration_seconds' => ['required', 'integer', 'min:1'],
            'is_preview' => ['nullable', 'boolean'],
            'order_index' => ['nullable', 'integer'],
            'attachment_urls' => ['nullable', 'array'],
        ];
    }
}
