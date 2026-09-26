<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Permissões de usuários
        $permissions = [
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Role admin com todas as permissões
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

        $adminPermissions = Permission::whereIn('name', $permissions)->get();
        $adminRole->syncPermissions($adminPermissions);
    }
}
