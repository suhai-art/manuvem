<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Item\ItemController;

Route::redirect('/', '/login')->name('home');

Route::middleware('auth')->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('items')->name('items.')->group(function () {
        Route::get('/', [ItemController::class, 'index'])->name('index');
        Route::get('/create', [ItemController::class, 'create'])->name('create');
        Route::post('/', [ItemController::class, 'store'])->name('store');
        Route::get('/{item}', [ItemController::class, 'show'])->name('show');
        Route::get('/{item}/edit', [ItemController::class, 'edit'])->name('edit');
        Route::put('/{item}', [ItemController::class, 'update'])->name('update');
        Route::delete('/{item}', [ItemController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
