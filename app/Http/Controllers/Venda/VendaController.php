<?php

namespace App\Http\Controllers\Venda;

use App\Http\Controllers\Controller;
use App\Http\Requests\Venda\StoreVendaRequest;
use App\Http\Requests\Venda\UpdateVendaRequest;
use App\Models\Cliente;
use App\Models\Item;
use App\Models\Venda;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VendaController extends Controller
{
    public function index(): Response
    {
        $vendas = Venda::with('cliente', 'itens')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('vendas/index', [
            'vendas' => $vendas,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vendas/create', $this->formOptions());
    }

    public function store(StoreVendaRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $venda = Venda::create($this->vendaAttributes($data));
        $this->syncItens($venda, $data['itens'] ?? []);

        return $this->redirectWithToast(__('Venda criada com sucesso.'));
    }

    public function show(Venda $venda): Response
    {
        return Inertia::render('vendas/show', [
            'venda' => $venda->load('itens'),
        ]);
    }

    public function edit(Venda $venda): Response
    {
        return Inertia::render('vendas/edit', array_merge(
            ['venda' => $this->serializeVenda($venda)],
            $this->formOptions(),
        ));
    }

    public function update(UpdateVendaRequest $request, Venda $venda): RedirectResponse
    {
        $data = $request->validated();

        $venda->update($this->vendaAttributes($data));
        $this->syncItens($venda, $data['itens'] ?? []);

        return $this->redirectWithToast(__('Venda atualizada com sucesso.'));
    }

    public function destroy(Venda $venda): RedirectResponse
    {
        $venda->delete();

        return $this->redirectWithToast(__('Venda excluída com sucesso.'));
    }

    /**
     * Listas usadas pelos selects do formulário (create e edit).
     *
     * @return array{clientes: \Illuminate\Database\Eloquent\Collection, items: \Illuminate\Database\Eloquent\Collection}
     */
    private function formOptions(): array
    {
        return [
            'clientes' => Cliente::select('id', 'name', 'documento')
                ->orderBy('name')
                ->get(),
            'items' => Item::select('id', 'name')
                ->orderBy('name')
                ->get(),
        ];
    }

    /**
     * Converte a venda para o formato esperado pelo VendaForm:
     * itens: [{ item: {id, name}, quantity, unit_price }]
     *
     * @return array<string, mixed>
     */
    private function serializeVenda(Venda $venda): array
    {
        $venda->load('cliente', 'itens');

        $itens = [];
        foreach ($venda->itens as $item) {
            $itens[] = [
                'item' => ['id' => $item->id, 'name' => $item->name],
                'quantity' => $item->pivot->quantity,
                'unit_price' => $item->pivot->unit_price,
            ];
        }

        return [
            'id' => $venda->id,
            'cliente' => $venda->cliente,
            'status' => $venda->status,
            'is_priority' => $venda->is_priority,
            'total' => $venda->total,
            'itens' => $itens,
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function vendaAttributes(array $data): array
    {
        return [
            'cliente_id' => $data['cliente_id'],
            'status' => $data['status'],
            'is_priority' => (bool) $data['is_priority'],
            'total' => $this->calcularTotal($data['itens'] ?? []),
        ];
    }

    /**
     * @param  array<int, array{item_id: int, quantity: int, unit_price: float}>  $itens
     */
    private function calcularTotal(array $itens): float
    {
        $total = 0.0;

        foreach ($itens as $item) {
            $total += (float) $item['quantity'] * (float) $item['unit_price'];
        }

        return $total;
    }

    /**
     * @param  array<int, array{item_id: int, quantity: int, unit_price: float}>  $itens
     */
    private function syncItens(Venda $venda, array $itens): void
    {
        $pivotData = [];

        foreach ($itens as $item) {
            $pivotData[$item['item_id']] = [
                'quantity' => (int) $item['quantity'],
                'unit_price' => (float) $item['unit_price'],
            ];
        }

        $venda->itens()->sync($pivotData);
    }

    private function redirectWithToast(string $message): RedirectResponse
    {
        return redirect()->route('vendas.index')
            ->with('toast', [
                'type' => 'success',
                'message' => $message,
            ]);
    }
}
