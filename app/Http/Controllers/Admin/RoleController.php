<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Http\Requests\Admin\Role\UpdateRoleRequest;
use App\Services\RoleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(private readonly RoleService $roleService) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/roles/index', [
            'roles' => $this->roleService->paginate($request->query('search')),
            'filters' => ['search' => $request->query('search', '')],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/roles/create', [
            'permissions' => $this->roleService->permissions(),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $this->roleService->create($request->validated(), $request->filled('permissions'));

        return redirect()->route('admin.roles.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Role criada com sucesso.'),
            ]);
    }

    public function show(Role $role): Response
    {
        return Inertia::render('admin/roles/show', [
            'role' => $this->roleService->withPermissions($role),
        ]);
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('admin/roles/edit', [
            'role' => $this->roleService->withPermissions($role),
            'permissions' => $this->roleService->permissions(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $this->roleService->update($role, $request->validated());

        return redirect()->route('admin.roles.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Role atualizada com sucesso.'),
            ]);
    }

    public function destroy(Role $role): RedirectResponse
    {
        $this->roleService->delete($role);

        return redirect()->route('admin.roles.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Role excluída com sucesso.'),
            ]);
    }
}
