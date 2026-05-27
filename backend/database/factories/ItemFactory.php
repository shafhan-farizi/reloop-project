<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    public function definition(): array
    {
        // 1. Pilih nama barang secara acak
        $title = fake()->randomElement([
            'Kaos Polos Uniqlo', 
            'Laptop Asus Bekas', 
            'Buku Novel Tere Liye', 
            'Blender Philips'
        ]);

        // 2. Tentukan kondisi barang secara acak
        $condition = fake()->randomElement(['baru', 'seperti baru', 'layak pakai']);

        // 3. Buat deskripsi dan cari nama kategori yang cocok berdasarkan judul barang
        switch ($title) {
            case 'Kaos Polos Uniqlo':
                $categorySearch = 'Pakaian';
                $description = "Dijual/didonasikan karena salah beli ukuran. Kondisi kain masih sangat bagus, warna tidak pudar, dan tidak ada bagian yang robek. Sangat nyaman digunakan untuk aktivitas sehari-hari karena bahannya yang adem. Kondisi barang saat ini adalah {$condition}.";
                break;

            case 'Laptop Asus Bekas':
                $categorySearch = 'Elektronik';
                $description = "Laptop bekas pemakaian kuliah. Semua fungsi keyboard, layar, dan baterai masih normal untuk kebutuhan mengetik atau belajar online. Kelengkapan sudah termasuk unit laptop beserta charger orisinal bawaan. Kondisi fisik barang terpantau {$condition}.";
                break;

            case 'Buku Novel Tere Liye':
                $categorySearch = 'Buku & Alat Tulis';
                $description = "Novel fisik orisinal yang sudah selesai dibaca. Seluruh halaman masih lengkap tanpa ada coretan, robekan, atau bekas lipatan yang parah. Sangat layak untuk dibaca kembali atau dijadikan koleksi perpustakaan mini. Kondisinya {$condition}.";
                break;

            case 'Blender Philips':
                $categorySearch = 'Perabotan';
                $description = "Peralatan dapur berupa blender yang jarang sekali dipakai. Mesin motor penggerak masih berputar dengan sangat kencang dan mata pisau masih tajam untuk menghaluskan buah atau bumbu masakan. Kondisi barang dipastikan {$condition}.";
                break;

            default:
                $categorySearch = 'Lainnya';
                $description = "Barang donasi bermanfaat dalam kondisi {$condition}. Silakan ajukan permintaan jika Anda atau yayasan Anda benar-benar membutuhkan barang ini.";
                break;
        }

        // 4. Cari ID Kategori di database berdasarkan nama di atas. Jika tidak ada, ambil acak.
        $categoryId = Category::where('name', 'LIKE', "%{$categorySearch}%")->first()?->id 
            ?? Category::inRandomOrder()->first()?->id 
            ?? Category::factory();

        return [
            'title'         => $title,
            'description'   => $description,
            'condition'     => $condition,
            'location'      => fake()->randomElement(['Jakarta Pusat', 'Depok', 'Bogor', 'Bandung', 'Surabaya']),
            'images'        => [
                'uploads/items/dummy1.jpg',
                'uploads/items/dummy2.jpg'
            ],
            'shipping_type' => fake()->randomElement(['free', 'paid']),
            'status'        => fake()->randomElement(['available', 'reserved', 'donated']),
            'donor_id'      => User::inRandomOrder()->first()?->id ?? User::factory(),
            'category_id'   => $categoryId,
        ];
    }
}
