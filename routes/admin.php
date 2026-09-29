<?php

use App\Http\Controllers\Admin\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware('auth')->group(function () {

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
