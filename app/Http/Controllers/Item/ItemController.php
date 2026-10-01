<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\StoreItemRequest;
use App\Http\Requests\Item\UpdateItemRequest;
use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function index(): Response
    {
        $items = Item::orderBy('name')->paginate(15);

        return Inertia::render('items/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('items/create');
    }

    public function store(StoreItemRequest $request): RedirectResponse
    {
        Item::create($request->validated());

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
        $item->update($request->validated());

        return redirect()->route('items.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Item atualizado com sucesso.'),
            ]);
    }

    public function destroy(Item $item): RedirectResponse
    {
        $item->delete();

        return redirect()->route('items.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Item excluído com sucesso.'),
            ]);
    }
}
