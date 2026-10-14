<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserService
{
    /**
     * @param  array<string, mixed>  $filters
     * @return array{users: LengthAwarePaginator, roles: \Illuminate\Support\Collection, filters: array<string, mixed>}
     */
    public function index(array $filters): array
    {
        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $perPage = (int) ($filters['per_page'] ?? 15);

        $query = User::query()->with('roles')->orderBy($sort, $direction);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['role'])) {
            $role = $filters['role'];
            $query->whereHas('roles', fn ($query) => $query->where('name', $role));
        }

        return [
            'users' => $query->paginate($perPage)->withQueryString(),
            'roles' => Role::pluck('name')->values(),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'role' => $filters['role'] ?? null,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ];
    }

    public function roles(): \Illuminate\Support\Collection
    {
        return Role::pluck('name')->values();
    }

    public function withRoles(User $user): User
    {
        return $user->load('roles');
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes, bool $assignRoles): User
    {
        $user = User::create([
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'password' => Hash::make($attributes['password']),
        ]);

        if ($assignRoles) {
            $user->syncRoles($attributes['roles']);
        }

        return $user;
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(User $user, array $attributes, bool $syncRoles, bool $syncPermissions): void
    {
        $user->update($attributes);

        if ($syncRoles) {
            $user->syncRoles($attributes['roles']);
        }

        if ($syncPermissions) {
            $user->syncPermissions($attributes['permissions']);
        }
    }

    public function delete(User $user): void
    {
        $user->delete();
    }
}
