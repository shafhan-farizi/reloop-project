<?php

namespace App\Models;

use Database\Factories\RequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['purpose', 'urgency_level', 'delivery_address', 'recipient_phone', 'status', 'rejection_reason', 'item_id', 'requester_id'])]
#[UseFactory(RequestFactory::class)]
class Request extends Model
{
    use HasFactory;
    
    /**
     * Relasi ke tabel USERS (Sebagai Pemohon / Requester)
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    /**
     * Relasi ke tabel ITEMS (Barang yang diminta)
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    /**
     * Relasi ke tabel SHIPMENTS
     * Request yang di-approve otomatis akan menghasilkan 1 data pengiriman.
     */
    public function shipment(): HasOne
    {
        return $this->hasOne(Shipment::class, 'request_id');
    }
}
