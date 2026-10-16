<?php

namespace App\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function paginate(?string $search = null): LengthAwarePaginator
    {
        return Role::query()
            ->withCount('permissions')
            ->when(
                $search !== null && $search !== '',
                fn ($query) => $query->where('name', 'like', "%{$search}%"),
            )
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();
    }

    public function permissions(): \Illuminate\Support\Collection
    {
        return Permission::orderBy('name')->get();
    }

    public function withPermissions(Role $role): Role
    {
        return $role->load('permissions');
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes, bool $syncPermissions): Role
    {
        $role = Role::create(['name' => $attributes['name']]);

        if ($syncPermissions) {
            $role->syncPermissions($attributes['permissions']);
        }

        return $role;
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Role $role, array $attributes): void
    {
        $role->update(['name' => $attributes['name']]);
        $role->syncPermissions($attributes['permissions'] ?? []);
    }

    public function delete(Role $role): void
    {
        $role->delete();
    }
}
