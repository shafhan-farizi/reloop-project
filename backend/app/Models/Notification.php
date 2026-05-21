<?php

namespace App\Models;

use Database\Factories\NotificationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['title', 'message', 'type', 'related_id', 'is_read', 'user_id'])]
#[UseFactory(NotificationFactory::class)]
class Notification extends Model
{
    use HasFactory;
    
    /**
     * Relasi ke tabel USERS (Pemilik notifikasi)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
