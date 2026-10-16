<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\StoreItemRequest;
use App\Http\Requests\Item\UpdateItemRequest;
use App\Models\Item;
use App\Services\ItemService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function __construct(private readonly ItemService $itemService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('items/index', [
            'items' => $this->itemService->paginate($request->query('search')),
            'filters' => ['search' => $request->query('search', '')],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('items/create');
    }

    public function store(StoreItemRequest $request): RedirectResponse
    {
        $this->itemService->create($request->validated());

        return redirect()->route('items.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Item criado com sucesso.'),
            ]);
    }

    public function show(Item $item): Response
    {
        return Inertia::render('items/show', [
            'item' => $item,
        ]);
    }

    public function edit(Item $item): Response
    {
        return Inertia::render('items/edit', [
            'item' => $item,
        ]);
    }

    public function update(
        UpdateItemRequest $request,
        Item $item
    ): RedirectResponse {
        $this->itemService->update($item, $request->validated());

        return redirect()->route('items.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Item atualizado com sucesso.'),
            ]);
    }

    public function destroy(Item $item): RedirectResponse
    {
        $this->itemService->delete($item);

        return redirect()->route('items.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Item excluído com sucesso.'),
            ]);
    }
}
