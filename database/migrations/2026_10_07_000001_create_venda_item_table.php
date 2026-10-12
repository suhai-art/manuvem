<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venda_item', function (Blueprint $table) {
            $table->foreignId('venda_id')->constrained()->cascadeOnDelete();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();

            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 10, 2);

            $table->primary(['venda_id', 'item_id']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venda_item');
    }
};
