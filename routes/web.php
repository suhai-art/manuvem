<?php

use App\Http\Controllers\Venda\VendaController;
use App\Http\Controllers\Cliente\ClienteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Item\ItemController;
use App\Models\Cliente;
use App\Models\Item;
use App\Models\Venda;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware('auth')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('relatorios', [VendaController::class, 'reports'])
        ->name('relatorios.index')
        ->middleware('can:viewAny,'.Venda::class);

    Route::prefix('items')->name('items.')->group(function () {
        Route::get('/', [ItemController::class, 'index'])
            ->name('index')
            ->middleware('can:viewAny,'.Item::class);

        Route::get('/create', [ItemController::class, 'create'])
            ->name('create')
            ->middleware('can:create,'.Item::class);

        Route::post('/', [ItemController::class, 'store'])
            ->name('store')
            ->middleware('can:create,'.Item::class);

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

    Route::prefix('clientes')->name('clientes.')->group(function () {
        Route::get('', [ClienteController::class, 'index'])
            ->name('index')
            ->middleware('can:viewAny,'.Cliente::class);

        Route::get('create', [ClienteController::class, 'create'])
            ->name('create')
            ->middleware('can:create,'.Cliente::class);

        Route::post('', [ClienteController::class, 'store'])
            ->name('store')
            ->middleware('can:create,'.Cliente::class);

        Route::get('{cliente}', [ClienteController::class, 'show'])
            ->name('show')
            ->middleware('can:view,cliente');

        Route::get('{cliente}/edit', [ClienteController::class, 'edit'])
            ->name('edit')
            ->middleware('can:update,cliente');

        Route::put('{cliente}', [ClienteController::class, 'update'])
            ->name('update')
            ->middleware('can:update,cliente');

        Route::delete('{cliente}', [ClienteController::class, 'destroy'])
            ->name('destroy')
            ->middleware('can:delete,cliente');
    });

    Route::prefix('vendas')->name('vendas.')->group(function () {
        Route::get('', [VendaController::class, 'index'])
            ->name('index')
            ->middleware('can:viewAny,'.Venda::class);

        Route::get('create', [VendaController::class, 'create'])
            ->name('create')
            ->middleware('can:create,'.Venda::class);

        Route::post('', [VendaController::class, 'store'])
            ->name('store')
            ->middleware('can:create,'.Venda::class);

        Route::get('{venda}', [VendaController::class, 'show'])
            ->name('show')
            ->middleware('can:view,venda');

        Route::get('{venda}/edit', [VendaController::class, 'edit'])
            ->name('edit')
            ->middleware('can:update,venda');

        Route::put('{venda}', [VendaController::class, 'update'])
            ->name('update')
            ->middleware('can:update,venda');

        Route::patch('{venda}/status', [VendaController::class, 'updateStatus'])
            ->name('update-status')
            ->middleware('can:update,venda');

        Route::patch('{venda}/priority', [VendaController::class, 'updatePriority'])
            ->name('update-priority')
            ->middleware('can:update,venda');

        Route::delete('{venda}', [VendaController::class, 'destroy'])
            ->name('destroy')
            ->middleware('can:delete,venda');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
