<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'item_type' => ['required', Rule::in(['course', 'package'])],
            'item_id' => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', Rule::in(['mada', 'credit_card', 'apple_pay', 'stc_pay', 'tabby', 'tamara'])],
            'coupon_code' => ['nullable', 'string', 'max:50'],
        ];
    }
}
