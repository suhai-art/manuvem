<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->runPermissionSeeder();
        $this->seedTestUser();
    }

    protected function runPermissionSeeder(): void
    {
        $this->call(PermissionSeeder::class);
    }

    protected function seedTestUser(): void
    {
        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

        $permissions = [
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
            $role->givePermissionTo($permission);
        }

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.com',
        ])->assignRole($role);
    }
}
