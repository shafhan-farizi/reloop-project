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
        $strgPath = 'storage/uploads/items';
        $lowerTitle = Str::lower($title); // Menggunakan helper Laravel agar seragam

        if (Str::contains($lowerTitle, 'kaos')) {
            return asset($strgPath . '/kaos-uniqlo-' . rand(1, 3) . '.webp');
        }
        if (Str::contains($lowerTitle, 'laptop')) {
            return asset($strgPath . '/laptop-asus-bekas-' . rand(1, 3) . '.webp');
        }
        if (Str::contains($lowerTitle, 'buku') || Str::contains($lowerTitle, 'novel')) {
            return asset($strgPath . '/novel-tereliye-' . rand(1, 3) . '.webp');
        }
        if (Str::contains($lowerTitle, 'blender')) {
            return asset($strgPath . '/blender-philips-' . rand(1, 3) . '.webp');
        }

        // Return null jika tidak ada kata yang cocok
        return ''; 
    }
}
