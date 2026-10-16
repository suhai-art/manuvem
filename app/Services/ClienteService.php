<?php

namespace App\Services;

use App\Models\Cliente;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ClienteService
{
    /**
    * @param  array{search?: string|null, sort?: string|null, direction?: string|null}  $filters
     * @return array{clientes: LengthAwarePaginator, filters: array<string, mixed>}
     */
    public function index(array $filters): array
    {
        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $perPage = 10;

        $query = Cliente::query()->orderBy($sort, $direction);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('documento', 'like', "%{$search}%");
            });
        }

        return [
            'clientes' => $query->paginate($perPage)->withQueryString(),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Cliente
    {
        return Cliente::create($attributes);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Cliente $cliente, array $attributes): void
    {
        $cliente->update($attributes);
    }

    public function delete(Cliente $cliente): void
    {
        $cliente->delete();
    }
}
