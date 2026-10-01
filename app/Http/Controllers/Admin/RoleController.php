<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Http\Requests\Admin\Role\UpdateRoleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::withCount('permissions')->orderBy('name')->paginate(15);

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
        ]);
    }

    public function create(): Response
    {
        $permissions = Permission::orderBy('name')->get();

        return Inertia::render('admin/roles/create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = Role::create([
            'name' => $request->validated('name'),
        ]);

        if ($request->filled('permissions')) {
            $role->syncPermissions($request->validated('permissions'));
        }

        return redirect()->route('admin.roles.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Role criada com sucesso.'),
            ]);
    }

    public function show(Role $role): Response
    {
        $role->load('permissions');

        return Inertia::render('admin/roles/show', [
            'role' => $role,
        ]);
    }

    public function edit(Role $role): Response
    {
        $permissions = Permission::orderBy('name')->get();
        $role->load('permissions');

        return Inertia::render('admin/roles/edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $role->update([
            'name' => $request->validated('name'),
        ]);

        if ($request->filled('permissions')) {
            $role->syncPermissions($request->validated('permissions'));
        } else {
            $role->syncPermissions([]);
        }

        return redirect()->route('admin.roles.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Role atualizada com sucesso.'),
            ]);
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Role excluída com sucesso.'),
            ]);
    }
}
