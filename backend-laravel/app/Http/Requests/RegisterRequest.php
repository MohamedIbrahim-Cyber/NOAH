<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'regex:/^(05)[0-9]{8}$/', 'unique:users,phone'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'grade_level' => ['required', Rule::in(['1st_secondary', '2nd_secondary', '3rd_secondary'])],
            'track' => ['required', Rule::in([
                'shared_year',
                'natural_sciences',
                'computing_engineering',
                'business_admin',
                'sharia_islamic_studies',
            ])],
        ];
    }
}
