<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\StoreUserRequest;
use App\Http\Requests\Admin\User\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $query = User::query()
            ->with('roles')
            ->orderBy($request->input('sort', 'created_at'), $request->input('direction', 'desc'));

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $role = $request->input('role');
            $query->whereHas('roles', fn($q) => $q->where('name', $role));
        }

        $perPage = (int) $request->input('per_page', 15);
        $users = $query->paginate($perPage)->withQueryString();

        $roles = \Spatie\Permission\Models\Role::pluck('name')->values();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $request->input('search'),
                'role' => $request->input('role'),
                'sort' => $request->input('sort', 'created_at'),
                'direction' => $request->input('direction', 'desc'),
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $roles = \Spatie\Permission\Models\Role::pluck('name')->values();

        return Inertia::render('admin/users/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => \Illuminate\Support\Facades\Hash::make($request->validated('password')),
        ]);

        if ($request->filled('roles')) {
            $user->syncRoles($request->validated('roles'));
        }

        if ($request->filled('permissions')) {
            $user->syncPermissions($request->validated('permissions'));
        }

        return redirect()->route('admin.users.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Usuário criado com sucesso.'),
            ]);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        return Inertia::render('admin/users/show', [
            'user' => $user->load('roles'),
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $roles = \Spatie\Permission\Models\Role::pluck('name')->values();

        return Inertia::render('admin/users/edit', [
            'user' => $user->load('roles'),
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->validated());

        if ($request->filled('roles')) {
            $user->syncRoles($request->validated('roles'));
        }

        if ($request->filled('permissions')) {
            $user->syncPermissions($request->validated('permissions'));
        }

        return redirect()->route('admin.users.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Usuário atualizado com sucesso.'),
            ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Usuário excluído com sucesso.'),
            ]);
    }
}
