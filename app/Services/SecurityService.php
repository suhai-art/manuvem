<?php

namespace App\Services;

use App\Models\User;

class SecurityService
{
    public function updatePassword(User $user, string $password): void
    {
        $user->update(['password' => $password]);
    }
}
