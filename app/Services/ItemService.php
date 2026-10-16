<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ItemService
{
    public function paginate(?string $search = null): LengthAwarePaginator
    {
        return Item::query()
            ->when($search !== null && $search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('internal_code', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Item
    {
        return Item::create($attributes);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Item $item, array $attributes): void
    {
        $item->update($attributes);
    }

    public function delete(Item $item): void
    {
        $item->delete();
    }
}
