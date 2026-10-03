<?php

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Item\ItemController;
use App\Models\Item;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

Route::prefix('admin')->middleware('auth')->group(function () {
    Route::prefix('roles')->group(function () {
        Route::get('', [RoleController::class, 'index'])
            ->name('admin.roles.index')
            ->middleware('can:viewAny,' . Role::class);

        Route::get('create', [RoleController::class, 'create'])
            ->name('admin.roles.create')
            ->middleware('can:create,' . Role::class);

        Route::post('', [RoleController::class, 'store'])
            ->name('admin.roles.store')
            ->middleware('can:create,' . Role::class);

        Route::get('{role}', [RoleController::class, 'show'])
            ->name('admin.roles.show')
            ->middleware('can:view,role');

        Route::get('{role}/edit', [RoleController::class, 'edit'])
            ->name('admin.roles.edit')
            ->middleware('can:update,role');

        Route::put('{role}', [RoleController::class, 'update'])
            ->name('admin.roles.update')
            ->middleware('can:update,role');

        Route::delete('{role}', [RoleController::class, 'destroy'])
            ->name('admin.roles.destroy')
            ->middleware('can:delete,role');
    });

    Route::prefix('users')->group(function() {
        Route::get('', [UserController::class, 'index'])
            ->name('admin.users.index')
            ->middleware('can:viewAny,' . User::class);

        Route::get('create', [UserController::class, 'create'])
            ->name('admin.users.create')
            ->middleware('can:create,' . User::class);

        Route::post('', [UserController::class, 'store'])
            ->name('admin.users.store')
            ->middleware('can:create,' . User::class);

        Route::get('{user}', [UserController::class, 'show'])
            ->name('admin.users.show')
            ->middleware('can:view,user');

        Route::get('{user}/edit', [UserController::class, 'edit'])
            ->name('admin.users.edit')
            ->middleware('can:update,user');

        Route::put('{user}', [UserController::class, 'update'])
            ->name('admin.users.update')
            ->middleware('can:update,user');

        Route::delete('{user}', [UserController::class, 'destroy'])
            ->name('admin.users.destroy')
            ->middleware('can:delete,user');

    });

});
