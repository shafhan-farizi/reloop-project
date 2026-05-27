<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

class RequestFactory extends Factory
{
    public function definition(): array
    {
        // 1. Ambil barang secara acak dari database atau buat baru jika kosong
        $item = Item::inRandomOrder()->first() ?? Item::factory()->create();
        
        // 2. Tentukan status pengajuan
        $status = fake()->randomElement(['pending', 'approved', 'rejected', 'cancelled']);

        // 3. Buat alasan penolakan (rejection_reason) HANYA JIKA statusnya 'rejected'
        $rejection_reason = null;
        if ($status === 'rejected') {
            $rejection_reason = fake()->randomElement([
                'Maaf, kuota penerima manfaat bulan ini sudah penuh.',
                'Alasan pengajuan kurang spesifik dan tidak melampirkan bukti pendukung.',
                'Lokasi Anda terlalu jauh dan di luar jangkauan pengiriman kurir kami.',
                'Prioritas donasi dialihkan kepada pemohon dengan tingkat urgensi yang lebih tinggi.'
            ]);
        }

        // 4. Buat variasi alasan kebutuhan (purpose) menyesuaikan dengan nama/judul barangnya
        $title = $item->title;
        if (str_contains(strtolower($title), 'laptop')) {
            $purpose = 'Sangat membutuhkan perangkat ini untuk keperluan kuliah, mengerjakan tugas akhir, dan belajar kelompok di kosan.';
        } elseif (str_contains(strtolower($title), 'kaos') || str_contains(strtolower($title), 'pakaian')) {
            $purpose = 'Untuk pakaian ganti harian anak-anak di panti asuhan kami karena persediaan pakaian layak pakai saat ini sangat menipis.';
        } elseif (str_contains(strtolower($title), 'buku') || str_contains(strtolower($title), 'novel')) {
            $purpose = 'Akan digunakan untuk menambah koleksi pojok baca gratis dan meningkatkan minat baca anak-anak di lingkungan sekitar.';
        } elseif (str_contains(strtolower($title), 'blender') || str_contains(strtolower($title), 'perabotan')) {
            $purpose = 'Sangat membantu untuk keperluan mengolah bahan makanan di dapur umum posko bencana/sosial keluarga kami.';
        } else {
            $purpose = 'Membutuhkan barang bantuan layak pakai ini untuk menunjang aktivitas sosial harian keluarga yang kekurangan.';
        }

        return [
            'purpose'           => $purpose,
            'urgency_level'     => fake()->randomElement(['rendah', 'sedang', 'tinggi']),
            'delivery_address'  => fake()->address(),
            'recipient_phone'   => fake()->phoneNumber(),
            'status'            => $status,
            'rejection_reason'  => $rejection_reason,
            'item_id'           => $item->id,
            // Mengambil user acak sebagai pemohon (requester)
            'requester_id'      => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}