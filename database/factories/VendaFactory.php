<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\Enums\VendaStatus;
use App\Models\Venda;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Venda>
 */
class VendaFactory extends Factory
{
    public function definition(): array
    {
        $hasCustomDate = fake()->boolean();

        return [
            'cliente_id' => Cliente::factory(),
            'name' => fake()->words(3, true),
            'external_id' => fake()->optional()->bothify('EXT-########'),
            'sale_date' => fake()->dateTimeBetween(now()->startOfMonth()->subMonths(5), 'now')->format('Y-m-d'),
            'has_custom_date' => $hasCustomDate,
            'status' => fake()->randomElement(VendaStatus::cases()),
            'is_priority' => fake()->boolean(),
            'total' => fake()->randomFloat(2, 10, 10000),
            'created_at' => fake()->dateTimeBetween(now()->startOfMonth()->subMonths(5), 'now'),
        ];
    }
}
