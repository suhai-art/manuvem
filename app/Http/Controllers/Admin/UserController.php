<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\StoreUserRequest;
use App\Http\Requests\Admin\User\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService) {}

    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('admin/users/index', [
            ...$this->userService->index($request->only(['search', 'role', 'sort', 'direction', 'per_page'])),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'roles' => $this->userService->roles(),
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->userService->create(
            $request->validated(),
            $request->filled('roles'),
            $request->user()->tenant_id,
        );

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
            'user' => $this->userService->withRoles($user),
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => $this->userService->withRoles($user),
            'roles' => $this->userService->roles(),
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->userService->update(
            $user,
            $request->validated(),
            $request->filled('roles'),
            $request->filled('permissions'),
        );

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
        $this->userService->delete($user);

        return redirect()->route('admin.users.index')
            ->with('toast', [
                'type' => 'success',
                'message' => __('Usuário excluído com sucesso.'),
            ]);
    }
}
