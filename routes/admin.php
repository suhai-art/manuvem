<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('users', [UserController::class, 'index'])
        ->name('admin.users.index')
        ->middleware('can:viewAny,' . \App\Models\User::class);

    Route::get('users/create', [UserController::class, 'create'])
        ->name('admin.users.create')
        ->middleware('can:create,user,' . \App\Models\User::class);

    Route::post('users', [UserController::class, 'store'])
        ->name('admin.users.store')
        ->middleware('can:create,user,' . \App\Models\User::class);

    Route::get('users/{user}', [UserController::class, 'show'])
        ->name('admin.users.show')
        ->middleware('can:view,user,' . \App\Models\User::class);

    Route::get('users/{user}/edit', [UserController::class, 'edit'])
        ->name('admin.users.edit')
        ->middleware('can:update,user,' . \App\Models\User::class);

    Route::put('users/{user}', [UserController::class, 'update'])
        ->name('admin.users.update')
        ->middleware('can:update,user,' . \App\Models\User::class);

    Route::delete('users/{user}', [UserController::class, 'destroy'])
        ->name('admin.users.destroy')
        ->middleware('can:delete,user,' . \App\Models\User::class);

});
