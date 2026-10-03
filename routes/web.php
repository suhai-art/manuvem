<?php

use App\Http\Controllers\Admin\ClienteController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Item\ItemController;
use App\Models\Cliente;
use App\Models\Item;

Route::redirect('/', '/login')->name('home');

Route::middleware('auth')->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('items')->name('items.')->group(function () {
        Route::get('/', [ItemController::class, 'index'])
            ->name('index')
            ->middleware('can:viewAny,' . Item::class);

        Route::get('/create', [ItemController::class, 'create'])
            ->name('create')
            ->middleware('can:create,' . Item::class);

        Route::post('/', [ItemController::class, 'store'])
            ->name('store')
            ->middleware('can:create,' . Item::class);

        Route::get('/{item}', [ItemController::class, 'show'])
            ->name('show')
            ->middleware('can:view,item');

        Route::get('/{item}/edit', [ItemController::class, 'edit'])
            ->name('edit')
            ->middleware('can:update,item');

        Route::put('/{item}', [ItemController::class, 'update'])
            ->name('update')
            ->middleware('can:update,item');

        Route::delete('/{item}', [ItemController::class, 'destroy'])
            ->name('destroy')
            ->middleware('can:delete,item');
    });

    Route::prefix('clientes')->group(function () {
        Route::get('', [ClienteController::class, 'index'])
            ->name('admin.clientes.index')
            ->middleware('can:viewAny,' . Cliente::class);

        Route::get('create', [ClienteController::class, 'create'])
            ->name('admin.clientes.create')
            ->middleware('can:create,' . Cliente::class);

        Route::post('', [ClienteController::class, 'store'])
            ->name('admin.clientes.store')
            ->middleware('can:create,' . Cliente::class);

        Route::get('{cliente}', [ClienteController::class, 'show'])
            ->name('admin.clientes.show')
            ->middleware('can:view,cliente');

        Route::get('{cliente}/edit', [ClienteController::class, 'edit'])
            ->name('admin.clientes.edit')
            ->middleware('can:update,cliente');

        Route::put('{cliente}', [ClienteController::class, 'update'])
            ->name('admin.clientes.update')
            ->middleware('can:update,cliente');

        Route::delete('{cliente}', [ClienteController::class, 'destroy'])
            ->name('admin.clientes.destroy')
            ->middleware('can:delete,cliente');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
