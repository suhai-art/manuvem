<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $clientesCount = Cliente::count();
        $itensCount = Item::count();

        return Inertia::render('dashboard', [
            'stats' => [
                'clientes' => $clientesCount,
                'itens' => $itensCount,
            ],
        ]);
    }
}