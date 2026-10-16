<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cliente\StoreClienteRequest;
use App\Http\Requests\Cliente\UpdateClienteRequest;
use App\Models\Cliente;
use App\Services\ClienteService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    public function __construct(private readonly ClienteService $clienteService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('clientes/index', [
            ...$this->clienteService->index($request->only(['search', 'sort', 'direction'])),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('clientes/create');
    }

    public function store(StoreClienteRequest $request): RedirectResponse
    {
        $this->clienteService->create($request->validated());

        return redirect()->route('clientes.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Cliente criado com sucesso.'),
            ]);
    }

    public function show(Cliente $cliente): Response
    {
        return Inertia::render('clientes/show', [
            'cliente' => $cliente,
        ]);
    }

    public function edit(Cliente $cliente): Response
    {
        return Inertia::render('clientes/edit', [
            'cliente' => $cliente,
        ]);
    }

    public function update(UpdateClienteRequest $request, Cliente $cliente): RedirectResponse
    {
        $this->clienteService->update($cliente, $request->validated());

        return redirect()->route('clientes.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Cliente atualizado com sucesso.'),
            ]);
    }

    public function destroy(Cliente $cliente): RedirectResponse
    {
        $this->clienteService->delete($cliente);

        return redirect()->route('clientes.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Cliente excluído com sucesso.'),
            ]);
    }
}
