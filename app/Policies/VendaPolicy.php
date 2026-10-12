<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Venda;
use Illuminate\Auth\Access\HandlesAuthorization;

class VendaPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('vendas.view');
    }

    public function view(User $user, Venda $venda): bool
    {
        return $user->can('vendas.view');
    }

    public function create(User $user): bool
    {
        return $user->can('vendas.create');
    }

    public function update(User $user, Venda $venda): bool
    {
        return $user->can('vendas.update');
    }

    public function delete(User $user, Venda $venda): bool
    {
        return $user->can('vendas.delete');
    }
}
