<?php

namespace App\Models;

use Database\Factories\ItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description', 'condition', 'location', 'images', 'shipping_type', 'status', 'donor_id', 'category_id'])]
#[UseFactory(ItemFactory::class)]
class Item extends Model
{
    use HasFactory;

    // Otomatis konversi JSON di DB menjadi Array PHP pas koding
    protected function casts(): array
    {
        return [
            'images' => 'array', // 
        ];
    }

    /**
     * Relasi ke tabel USERS (Sebagai Donatur)
     */
    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'donor_id');
    }

    /**
     * Relasi ke tabel CATEGORIES
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Relasi ke tabel REQUESTS
     * Satu barang bisa diajukan oleh banyak calon penerima (antrean).
     */
    public function requests(): HasMany
    {
        return $this->hasMany(Request::class, 'item_id');
    }
}
