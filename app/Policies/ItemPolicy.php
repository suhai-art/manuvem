<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ItemPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('items.view');
    }

    public function view(User $user, Item $item): bool
    {
        return $user->can('items.view');
    }

    public function create(User $user): bool
    {
        return $user->can('items.create');
    }

    public function update(User $user, Item $role): bool
    {
        return $user->can('items.update');
    }

    public function delete(User $user, Item $role): bool
    {
        return $user->can('items.delete');
    }
}
