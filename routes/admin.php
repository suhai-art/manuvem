<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

Route::prefix('admin')->middleware('auth')->group(function () {

    Route::get('roles', [RoleController::class, 'index'])
        ->name('admin.roles.index')
        ->middleware('can:viewAny,' . Role::class);

    Route::get('roles/create', [RoleController::class, 'create'])
        ->name('admin.roles.create')
        ->middleware('can:create,' . Role::class);

    Route::post('roles', [RoleController::class, 'store'])
        ->name('admin.roles.store')
        ->middleware('can:create,' . Role::class);

    Route::get('roles/{role}', [RoleController::class, 'show'])
        ->name('admin.roles.show')
        ->middleware('can:view,role');

    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])
        ->name('admin.roles.edit')
        ->middleware('can:update,role');

    Route::put('roles/{role}', [RoleController::class, 'update'])
        ->name('admin.roles.update')
        ->middleware('can:update,role');

    Route::delete('roles/{role}', [RoleController::class, 'destroy'])
        ->name('admin.roles.destroy')
        ->middleware('can:delete,role');

    Route::get('users', [UserController::class, 'index'])
        ->name('admin.users.index')
        ->middleware('can:viewAny,' . User::class);

    Route::get('users/create', [UserController::class, 'create'])
        ->name('admin.users.create')
        ->middleware('can:create,' . User::class);

    Route::post('users', [UserController::class, 'store'])
        ->name('admin.users.store')
        ->middleware('can:create,' . User::class);

    Route::get('users/{user}', [UserController::class, 'show'])
        ->name('admin.users.show')
        ->middleware('can:view,user');

    Route::get('users/{user}/edit', [UserController::class, 'edit'])
        ->name('admin.users.edit')
        ->middleware('can:update,user');

    Route::put('users/{user}', [UserController::class, 'update'])
        ->name('admin.users.update')
        ->middleware('can:update,user');

    Route::delete('users/{user}', [UserController::class, 'destroy'])
        ->name('admin.users.destroy')
        ->middleware('can:delete,user');
});
