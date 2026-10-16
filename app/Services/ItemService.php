<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ItemService
{
    public function paginate(): LengthAwarePaginator
    {
        return Item::orderBy('name')->paginate(10);
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
