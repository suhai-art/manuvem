<?php

namespace App\Models\Enums;

enum VendaStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pendente',
            self::CONFIRMED => 'Confirmado',
            self::COMPLETED => 'Concluído',
            self::CANCELLED => 'Cancelado',
        };
    }
}
