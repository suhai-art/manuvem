<?php

namespace App\Http\Requests\Venda;

use App\Models\Venda;
use Illuminate\Foundation\Http\FormRequest;

class StoreVendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Venda::class);
    }

    public function rules(): array
    {
        return [
            'cliente_id' => ['required', 'integer', 'exists:clientes,id'],
            'status' => ['required', 'string', 'in:pending,confirmed,completed,cancelled'],
            'is_priority' => ['boolean'],
            'items' => ['required', 'array'],
            'items.*.item_id' => ['required', 'integer', 'exists:items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}
