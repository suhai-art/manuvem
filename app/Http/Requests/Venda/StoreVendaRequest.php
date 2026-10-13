<?php

namespace App\Http\Requests\Venda;

use App\Models\Venda;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'name' => ['nullable', 'string', 'max:255'],
            'external_id' => ['nullable', 'string', 'max:255'],
            'has_custom_date' => ['required', 'boolean'],
            'sale_date' => [Rule::requiredIf($this->boolean('has_custom_date')), 'nullable', 'date_format:Y-m-d'],
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
