<?php

namespace App\Http\Requests\Venda;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('venda'));
    }

    public function rules(): array
    {
        return [
            'cliente_id' => ['required', 'integer', 'exists:clientes,id'],
            'status' => ['required', 'string', 'in:pending,confirmed,completed,cancelled'],
            'is_priority' => ['boolean'],
            'itens' => ['required', 'array'],
            'itens.*.item_id' => ['required', 'integer', 'exists:items,id'],
            'itens.*.quantity' => ['required', 'integer', 'min:1'],
            'itens.*.unit_price' => ['required', 'numeric', 'min:0'],
            'itens.*.description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
