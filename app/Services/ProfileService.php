<?php

namespace App\Services;

use App\Models\User;

class ProfileService
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(User $user, array $attributes): void
    {
        $user->fill($attributes);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
    }

    public function delete(User $user): void
    {
        $user->delete();
    }
}
