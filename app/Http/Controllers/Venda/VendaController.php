<?php

namespace App\Http\Controllers\Venda;

use App\Http\Controllers\Controller;
use App\Http\Requests\Venda\StoreVendaRequest;
use App\Http\Requests\Venda\UpdateVendaRequest;
use App\Models\Enums\VendaStatus;
use App\Models\Venda;
use App\Services\CompanyLogoService;
use App\Services\VendaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;

class VendaController extends Controller
{
    public function __construct(
        private readonly VendaService $vendaService,
        private readonly CompanyLogoService $companyLogoService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('vendas/index', [
            'vendas' => $this->vendaService->paginate(),
        ]);
    }

    public function reports(Request $request): Response
    {
        $filters = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'cliente_id' => ['nullable', 'integer', 'exists:clientes,id'],
            'status' => ['nullable', Rule::enum(VendaStatus::class)],
        ]);

        return Inertia::render('relatorios/index', [
            ...$this->vendaService->reports($filters),
        ]);
    }

    public function reportsPdf(Request $request): Response
    {
        $filters = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'cliente_id' => ['nullable', 'integer', 'exists:clientes,id'],
            'status' => ['nullable', Rule::enum(VendaStatus::class)],
        ]);
        return Inertia::render('relatorios/pdf', [
            ...$this->vendaService->reportsPdf($filters),
            'companyLogoUrl' => $this->companyLogoService->url($request->user()->tenant),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vendas/create', $this->vendaService->formOptions());
    }

    public function store(StoreVendaRequest $request): RedirectResponse
    {
        $this->vendaService->create($request->validated());

        return $this->redirectWithToast(__('Venda criada com sucesso.'));
    }

    public function show(Request $request, Venda $venda): Response
    {
        return Inertia::render('vendas/show', [
            'venda' => $this->vendaService->show($venda),
            'companyLogoUrl' => $this->companyLogoService->url($request->user()->tenant),
            ...$this->vendaService->formOptions(),
        ]);
    }

    public function edit(Venda $venda): Response
    {
        return Inertia::render('vendas/edit', $this->vendaService->editData($venda));
    }

    public function update(UpdateVendaRequest $request, Venda $venda): RedirectResponse
    {
        $this->vendaService->update($venda, $request->validated());

        return $this->redirectWithToast(__('Venda atualizada com sucesso.'));
    }

    public function updateStatus(Request $request, Venda $venda): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::enum(VendaStatus::class)],
        ]);

        $this->vendaService->updateStatus($venda, $data['status']);

        return $this->redirectWithToast(__('Status da venda atualizado com sucesso.'));
    }

    public function updatePriority(Request $request, Venda $venda): RedirectResponse
    {
        $data = $request->validate([
            'is_priority' => ['required', 'boolean'],
        ]);

        $this->vendaService->updatePriority($venda, $data['is_priority']);

        return $this->redirectWithToast(__('Prioridade da venda atualizada com sucesso.'));
    }

    public function destroy(Venda $venda): RedirectResponse
    {
        $this->vendaService->delete($venda);

        return $this->redirectWithToast(__('Venda excluída com sucesso.'));
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
