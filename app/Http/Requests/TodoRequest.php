<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TodoRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'note' => 'nullable|string',
            'cover' => 'nullable|image|max:2048',
            'status' => 'required|in:pending,done',
            'due_date' => 'nullable|date',
        ];
    }
}
