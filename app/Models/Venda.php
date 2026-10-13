<?php

namespace App\Models;

use App\Models\Enums\VendaStatus;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/** @property int $id
 * @property int $cliente_id
 * @property string|null $name
 * @property string|null $external_id
 * @property Carbon|null $sale_date
 * @property bool $has_custom_date
 * @property string $status
 * @property bool $is_priority
 * @property float $total
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property VendaStatus $status
 * @property-read Cliente $cliente
 * @property-read Collection|Item[] $itens
 */
class Venda extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'vendas';

    protected $fillable = [
        'cliente_id',
        'name',
        'external_id',
        'sale_date',
        'has_custom_date',
        'status',
        'is_priority',
        'total',
    ];

    protected function casts(): array
    {
        return [
            'cliente_id' => 'integer',
            'sale_date' => 'date:Y-m-d',
            'has_custom_date' => 'boolean',
            'status' => VendaStatus::class,
            'is_priority' => 'boolean',
            'total' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function itens(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'venda_item', 'venda_id', 'item_id')
            ->withPivot('quantity', 'unit_price', 'description')
            ->withTimestamps();
    }
}
