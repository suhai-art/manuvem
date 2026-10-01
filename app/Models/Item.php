<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'items';

    protected $fillable = [
        'internal_code',
        'name',
        'description',
        'default_unit_price',
    ];

    protected function casts(): array
    {
        return [
            'default_unit_price' => 'decimal:2',
        ];
    }
}
