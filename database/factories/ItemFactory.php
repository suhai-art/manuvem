<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Item>
 */
class ItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'internal_code' => fake()->unique()->bothify('ITEM-########'),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'default_unit_price' => fake()->randomFloat(2, 0, 99999999.99),
        ];
    }
}
