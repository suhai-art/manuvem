<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Cliente\StoreClienteRequest;
use App\Http\Requests\Admin\Cliente\UpdateClienteRequest;
use App\Models\Cliente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Cliente::query()
            ->orderBy($request->input('sort', 'created_at'), $request->input('direction', 'desc'));

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('documento', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->input('per_page', 15);
        $clientes = $query->paginate($perPage)->withQueryString();

        return Inertia::render('admin/clientes/index', [
            'clientes' => $clientes,
            'filters' => [
                'search' => $request->input('search'),
                'sort' => $request->input('sort', 'created_at'),
                'direction' => $request->input('direction', 'desc'),
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/clientes/create');
    }

    public function store(StoreClienteRequest $request): RedirectResponse
    {
        $cliente = Cliente::create($request->validated());

        return redirect()->route('admin.clientes.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Cliente criado com sucesso.'),
            ]);
    }

    public function show(Cliente $cliente): Response
    {
        return Inertia::render('admin/clientes/show', [
            'cliente' => $cliente,
        ]);
    }

    public function edit(Cliente $cliente): Response
    {
        return Inertia::render('admin/clientes/edit', [
            'cliente' => $cliente,
        ]);
    }

    public function update(UpdateClienteRequest $request, Cliente $cliente): RedirectResponse
    {
        $cliente->update($request->validated());

        return redirect()->route('admin.clientes.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Cliente atualizado com sucesso.'),
            ]);
    }

    public function destroy(Cliente $cliente): RedirectResponse
    {
        $cliente->delete();

        return redirect()->route('admin.clientes.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Cliente excluído com sucesso.'),
            ]);
    }
}