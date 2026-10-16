<?php

namespace App\Services;

use App\Models\Cliente;
use App\Models\Enums\VendaStatus;
use App\Models\Item;
use App\Models\User;
use App\Models\Venda;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class DashboardService
{
    /**
    * @return array{clientes: int|null, itens: int|null, pode_criar_venda: bool, vendas: array{receita_mes: float, receita_mes_anterior: float, vendas_mes: int, pendentes: int, evolucao: array<int, array{mes: string, receita: float}>, recentes: array<int, array{id: int, nome: string, cliente: string|null, data: string|null, total: float, status: string, prioritario: bool}>}|null}
     */
    public function stats(User $user): array
    {
        return [
            'clientes' => $user->can('clientes.view') ? Cliente::count() : null,
            'itens' => $user->can('items.view') ? Item::count() : null,
            'pode_criar_venda' => $user->can('vendas.create'),
            'vendas' => $user->can('vendas.view') ? $this->salesStats() : null,
        ];
    }

    /**
     * @return array{receita_mes: float, receita_mes_anterior: float, vendas_mes: int, pendentes: int, evolucao: array<int, array{mes: string, receita: float}>, recentes: array<int, array{id: int, nome: string, cliente: string|null, data: string|null, total: float, status: string, prioritario: bool}>}
     */
    private function salesStats(): array
    {
        $today = Carbon::now();
        $monthStart = $today->copy()->startOfMonth();
        $rangeStart = $monthStart->copy()->subMonths(5);
        $rangeEnd = $monthStart->copy()->addMonth();

        $sales = Venda::query()
            ->where(function (Builder $query) use ($rangeStart, $rangeEnd) {
                $query->where(function (Builder $query) use ($rangeStart, $rangeEnd) {
                    $query->where('has_custom_date', true)
                        ->whereDate('sale_date', '>=', $rangeStart)
                        ->whereDate('sale_date', '<', $rangeEnd);
                })->orWhere(function (Builder $query) use ($rangeStart, $rangeEnd) {
                    $query->where('has_custom_date', false)
                        ->where('created_at', '>=', $rangeStart)
                        ->where('created_at', '<', $rangeEnd);
                });
            })
            ->get(['total', 'status', 'sale_date', 'has_custom_date', 'created_at']);

        $revenueByMonth = [];
        $salesThisMonth = 0;

        for ($offset = 5; $offset >= 0; $offset--) {
            $month = $monthStart->copy()->subMonths($offset)->format('Y-m');
            $revenueByMonth[$month] = 0.0;
        }

        foreach ($sales as $sale) {
            $date = $sale->has_custom_date ? $sale->sale_date : $sale->created_at;
            $month = $date?->format('Y-m');
            $status = $sale->status instanceof VendaStatus
                ? $sale->status
                : VendaStatus::from($sale->status);

            if (! $month || ! array_key_exists($month, $revenueByMonth)) {
                continue;
            }

            if ($month === $monthStart->format('Y-m') && $status !== VendaStatus::CANCELLED) {
                $salesThisMonth++;
            }

            if (in_array($status, [VendaStatus::CONFIRMED, VendaStatus::COMPLETED], true)) {
                $revenueByMonth[$month] += (float) $sale->total;
            }
        }

        $evolution = [];
        foreach ($revenueByMonth as $month => $revenue) {
            $evolution[] = ['mes' => $month, 'receita' => $revenue];
        }

        $recentSales = Venda::query()
            ->with('cliente:id,name')
            ->latest()
            ->limit(6)
            ->get();

        return [
            'receita_mes' => $revenueByMonth[$monthStart->format('Y-m')] ?? 0.0,
            'receita_mes_anterior' => $revenueByMonth[$monthStart->copy()->subMonth()->format('Y-m')] ?? 0.0,
            'vendas_mes' => $salesThisMonth,
            'pendentes' => Venda::query()->where('status', VendaStatus::PENDING)->count(),
            'evolucao' => $evolution,
            'recentes' => $recentSales->map(function (Venda $sale) {
                $date = $sale->has_custom_date ? $sale->sale_date : $sale->created_at;

                return [
                    'id' => $sale->id,
                    'nome' => $sale->name ?: $sale->external_id ?: 'Venda #'.$sale->id,
                    'cliente' => $sale->cliente?->name,
                    'data' => $date?->toDateString(),
                    'total' => (float) $sale->total,
                    'status' => $sale->status instanceof VendaStatus
                        ? $sale->status->value
                        : VendaStatus::from($sale->status)->value,
                    'prioritario' => $sale->is_priority,
                ];
            })->all(),
        ];
    }
}
