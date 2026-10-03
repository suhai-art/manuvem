<?php

namespace App\Http\Requests\Admin\Cliente;

use App\Models\Cliente;
use Illuminate\Foundation\Http\FormRequest;

class UpdateClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('cliente'));
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'documento' => ['nullable', 'string', 'max:255'],
        ];
    }
}