<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Item;

class DashboardService
{
    /**
     * @return array{clientes: int, itens: int}
     */
    public function stats(): array
    {
        return [
            'clientes' => Cliente::count(),
            'itens' => Item::count(),
        ];
    }
}
