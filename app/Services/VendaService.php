<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Enums\VendaStatus;
use App\Models\Item;
use App\Models\Venda;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class VendaService
{
    public function paginate(): LengthAwarePaginator
    {
        return Venda::with('cliente', 'itens')->orderBy('created_at', 'desc')->paginate(10);
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{vendas: LengthAwarePaginator, clientes: Collection, filters: array<string, mixed>}
     */
    public function reports(array $filters): array
    {
        return [
            'vendas' => $this->reportsQuery($filters)->paginate(10)->withQueryString(),
            'clientes' => Cliente::query()->select('id', 'name')->orderBy('name')->get(),
            'filters' => $this->formatFilters($filters),
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{vendas: Collection, filters: array<string, mixed>}
     */
    public function reportsPdf(array $filters): array
    {
        return [
            'vendas' => $this->reportsQuery($filters)->with('itens')->get(),
            'filters' => $this->formatFilters($filters),
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{start_date: mixed, end_date: mixed, cliente_id: mixed, status: mixed}
     */
    private function formatFilters(array $filters): array
    {
        return [
            'start_date' => $filters['start_date'] ?? '',
            'end_date' => $filters['end_date'] ?? '',
            'cliente_id' => $filters['cliente_id'] ?? '',
            'status' => $filters['status'] ?? '',
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return Builder<Venda>
     */
    private function reportsQuery(array $filters): Builder
    {
        $query = Venda::with('cliente');

        if (! empty($filters['cliente_id'])) {
            $query->where('cliente_id', $filters['cliente_id']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['start_date']) || ! empty($filters['end_date'])) {
            $query->where(function ($query) use ($filters) {
                $query->where(function ($query) use ($filters) {
                    $query->where('has_custom_date', true);

                    if (! empty($filters['start_date'])) {
                        $query->whereDate('sale_date', '>=', $filters['start_date']);
                    }

                    if (! empty($filters['end_date'])) {
                        $query->whereDate('sale_date', '<=', $filters['end_date']);
                    }
                })->orWhere(function ($query) use ($filters) {
                    $query->where('has_custom_date', false);

                    if (! empty($filters['start_date'])) {
                        $query->whereDate('created_at', '>=', $filters['start_date']);
                    }

                    if (! empty($filters['end_date'])) {
                        $query->whereDate('created_at', '<=', $filters['end_date']);
                    }
                });
            });
        }

        return $query->orderByRaw('CASE WHEN has_custom_date THEN sale_date ELSE created_at END DESC');
    }

    /**
     * @return array{clientes: Collection, items: Collection}
     */
    public function formOptions(): array
    {
        return [
            'clientes' => Cliente::select('id', 'name', 'documento')->orderBy('name')->get(),
            'items' => Item::select('id', 'internal_code', 'name', 'default_unit_price')->orderBy('name')->get(),
        ];
    }

    public function show(Venda $venda): Venda
    {
        return $venda->load('cliente', 'itens');
    }

    /**
     * @return array{venda: array<string, mixed>, clientes: Collection, items: Collection}
     */
    public function editData(Venda $venda): array
    {
        return ['venda' => $this->serializeVenda($venda), ...$this->formOptions()];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Venda
    {
        $venda = Venda::create($this->vendaAttributes($data));
        $this->syncItens($venda, $data['itens'] ?? []);

        return $venda;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Venda $venda, array $data): void
    {
        $venda->update($this->vendaAttributes($data));
        $this->syncItens($venda, $data['itens'] ?? []);
    }

    public function updateStatus(Venda $venda, string $status): void
    {
        $venda->update(['status' => VendaStatus::from($status)]);
    }

    public function updatePriority(Venda $venda, bool $isPriority): void
    {
        $venda->update(['is_priority' => $isPriority]);
    }

    public function delete(Venda $venda): void
    {
        $venda->delete();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function vendaAttributes(array $data): array
    {
        $hasCustomDate = (bool) ($data['has_custom_date'] ?? false);

        return [
            'cliente_id' => $data['cliente_id'],
            'name' => $data['name'] ?? null,
            'external_id' => $data['external_id'] ?? null,
            'sale_date' => $hasCustomDate ? $data['sale_date'] : null,
            'has_custom_date' => $hasCustomDate,
            'status' => $data['status'],
            'is_priority' => (bool) $data['is_priority'],
            'total' => $this->calculateTotal($data['itens'] ?? []),
        ];
    }

    /**
     * @param  array<int, array{item_id: int, quantity: int, unit_price: float}>  $items
     */
    private function calculateTotal(array $items): float
    {
        $total = 0.0;

        foreach ($items as $item) {
            $total += (float) $item['quantity'] * (float) $item['unit_price'];
        }

        return $total;
    }

    /**
     * @param  array<int, array{item_id: int, quantity: int, unit_price: float, description?: string|null}>  $items
     */
    private function syncItens(Venda $venda, array $items): void
    {
        $venda->itens()->detach();

        foreach ($items as $item) {
            $venda->itens()->attach($item['item_id'], [
                'quantity' => (int) $item['quantity'],
                'unit_price' => (float) $item['unit_price'],
                'description' => $item['description'] ?? null,
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeVenda(Venda $venda): array
    {
        $venda->load('cliente', 'itens');
        $items = [];

        foreach ($venda->itens as $item) {
            $items[] = [
                'item' => ['id' => $item->id, 'name' => $item->name],
                'quantity' => $item->pivot->quantity,
                'unit_price' => $item->pivot->unit_price,
                'description' => $item->pivot->description,
            ];
        }

        return [
            'id' => $venda->id,
            'name' => $venda->name,
            'external_id' => $venda->external_id,
            'sale_date' => $venda->sale_date?->format('Y-m-d'),
            'has_custom_date' => $venda->has_custom_date,
            'cliente' => $venda->cliente,
            'status' => $venda->status,
            'is_priority' => $venda->is_priority,
            'total' => $venda->total,
            'itens' => $items,
        ];
    }
}
