<?php

namespace App\Models;

use Database\Factories\CategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'description'])]
#[UseFactory(CategoryFactory::class)]
class Category extends Model
{
    use HasFactory;
    /**
     * Relasi ke tabel ITEMS
     * Mengambil semua barang yang termasuk dalam kategori ini.
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'category_id');
    }
}