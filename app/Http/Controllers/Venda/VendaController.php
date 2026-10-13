<?php

namespace App\Http\Controllers\Venda;

use App\Http\Controllers\Controller;
use App\Http\Requests\Venda\StoreVendaRequest;
use App\Http\Requests\Venda\UpdateVendaRequest;
use App\Models\Cliente;
use App\Models\Enums\VendaStatus;
use App\Models\Item;
use App\Models\Venda;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;

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

    public function show(Request $request, Venda $venda): Response
    {
        $logoPath = $request->user()->company_logo_path;

        return Inertia::render('vendas/show', [
            'venda' => $venda->load('cliente', 'itens'),
            'companyLogoUrl' => $logoPath ? route('company.logo.image', absolute: false) : null,
            $this->formOptions(),
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

    public function updateStatus(Request $request, Venda $venda): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::enum(VendaStatus::class)],
        ]);

        $venda->update([
            'status' => VendaStatus::from($data['status']),
        ]);

        return $this->redirectWithToast(__('Status da venda atualizado com sucesso.'));
    }

    public function updatePriority(Request $request, Venda $venda): RedirectResponse
    {
        $data = $request->validate([
            'is_priority' => ['required', 'boolean'],
        ]);

        $venda->update([
            'is_priority' => $data['is_priority'],
        ]);

        return $this->redirectWithToast(__('Prioridade da venda atualizada com sucesso.'));
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
            'items' => Item::select('id', 'name', 'default_unit_price')
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
            'itens' => $itens,
        ];
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
        $venda->itens()->detach();

        foreach ($itens as $item) {
            $venda->itens()->attach($item['item_id'], [
                'quantity' => (int) $item['quantity'],
                'unit_price' => (float) $item['unit_price'],
                'description' => $item['description'] ?? null,
            ]);
        }
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
