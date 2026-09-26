<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionSeeder::class);

        $adminRole = Role::findByName('admin', 'web');
        $userRole = Role::findByName('user', 'web');

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.com',
        ])->assignRole($adminRole);

        User::factory()->create([
            'name' => 'Normal User',
            'email' => 'user@test.com',
        ])->assignRole($userRole);
    }
}
