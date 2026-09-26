<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allows($user, 'users.view');
    }

    public function view(User $user, User $subject): bool
    {
        return $this->allows($user, 'users.view');
    }

    public function create(User $user): bool
    {
        return $this->allows($user, 'users.create');
    }

    public function update(User $user, User $subject): bool
    {
        return $this->allows($user, 'users.update');
    }

    public function delete(User $user, User $subject): bool
    {
        return $this->allows($user, 'users.delete');
    }

    private function allows(User $user, string $permission): bool
    {
        return $user->hasRole('admin') || $user->checkPermissionTo($permission);
    }
}
