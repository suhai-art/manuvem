<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('cliente_id')->constrained()->cascadeOnDelete();

            $table->string('status', 20)->default('pending');

            $table->boolean('is_priority')->default(false);

            $table->decimal('total', 12, 2)->default(0.00);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendas');
    }
};
