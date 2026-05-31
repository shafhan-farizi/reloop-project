<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait RandomImageItems
{
    /**
     * Mengembalikan URL gambar items acak berdasarkan kemiripan judul item.
     */
    public function randomizeImage(string $title): ?string
    {
        $lowerTitle = Str::lower($title); // Menggunakan helper Laravel agar seragam

        if (Str::contains($lowerTitle, 'kaos')) {
            return 'uploads/items/kaos-uniqlo-' . rand(1, 3) . '.webp';
        }
        if (Str::contains($lowerTitle, 'laptop')) {
            return 'uploads/items/laptop-asus-bekas-' . rand(1, 3) . '.webp';
        }
        if (Str::contains($lowerTitle, 'buku') || Str::contains($lowerTitle, 'novel')) {
            return 'uploads/items/novel-tereliye-' . rand(1, 3) . '.webp';
        }
        if (Str::contains($lowerTitle, 'blender')) {
            return 'uploads/items/blender-philips-' . rand(1, 3) . '.webp';
        }

        // Return null jika tidak ada kata yang cocok
        return ''; 
    }
}
