<?php

namespace App\Models;

use Database\Factories\ShipmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['courier', 'tracking_number', 'cod_amount', 'status', 'shipped_at', 'delivered_at', 'rating', 'feedback_message', 'feedback_images', 'request_id'])]
#[UseFactory(ShipmentFactory::class)]
class Shipment extends Model
{
    use HasFactory;
    
    // Casting feedback_images bertipe JSON menjadi array
    protected function casts(): array
    {
        return [
            'feedback_images' => 'array',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    /**
     * Relasi balik ke tabel REQUESTS
     */
    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class, 'request_id');
    }
}