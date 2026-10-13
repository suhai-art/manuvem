<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('company_logo_path')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable()->constrained()->restrictOnDelete();
        });

        DB::table('users')->orderBy('id')->chunkById(100, function ($users) {
            foreach ($users as $user) {
                $tenantId = DB::table('tenants')->insertGetId([
                    'company_logo_path' => $user->company_logo_path,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('users')->where('id', $user->id)->update(['tenant_id' => $tenantId]);
            }
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable(false)->change();
            $table->dropColumn('company_logo_path');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('company_logo_path')->nullable();
        });

        DB::table('users')
            ->join('tenants', 'users.tenant_id', '=', 'tenants.id')
            ->update(['users.company_logo_path' => DB::raw('tenants.company_logo_path')]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('tenant_id');
        });

        Schema::dropIfExists('tenants');
    }
};
