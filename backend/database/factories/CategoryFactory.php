<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        // 1. Ambil nama kategori unik secara acak
        $categoryName = fake()->unique()->randomElement([
            'Elektronik', 
            'Pakaian', 
            'Buku & Alat Tulis', 
            'Mainan Anak', 
            'Perabotan'
        ]);

        // 2. Petakan deskripsi yang cocok berdasarkan nama kategorinya
        $descriptions = [
            'Elektronik'       => 'Donasi perangkat elektronik layak pakai seperti laptop, smartphone, atau lampu belajar untuk mendukung aktivitas harian.',
            'Pakaian'          => 'Koleksi pakaian layak pakai, selimut, dan perlengkapan sandang lainnya yang sudah bersih dan dikemas dengan rapi.',
            'Buku & Alat Tulis' => 'Buku bacaan edukatif, buku pelajaran sekolah, serta alat tulis untuk mendukung kegiatan belajar anak-anak.',
            'Mainan Anak'      => 'Mainan anak-anak yang aman, bersih, dan edukatif untuk menghibur serta melatih kreativitas anak di panti asuhan.',
            'Perabotan'        => 'Perlengkapan rumah tangga dasar seperti kasur lipat, kipas angin, atau peralatan dapur untuk keluarga yang membutuhkan.'
        ];

        // 3. Ambil deskripsi yang sesuai, atau beri teks default jika tidak cocok
        $description = $descriptions[$categoryName] ?? 'Kategori donasi barang layak pakai untuk disalurkan kepada penerima manfaat.';

        return [
            'name'        => $categoryName,
            'description' => $description,
        ];
    }
}