<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        // 1. Pilih tipe notifikasi secara acak
        $type = fake()->randomElement(['request_approved', 'item_shipped', 'new_request']);

        // 2. Tentukan judul (title) dan isi pesan (message) berdasarkan tipenya
        switch ($type) {
            case 'request_approved':
                $title = 'Permintaan Disetujui!';
                $message = 'Selamat! Permintaan barang donasi kamu telah disetujui oleh donor. Silakan cek detail pengiriman.';
                break;
                
            case 'item_shipped':
                $title = 'Barang Telah Dikirim';
                $message = 'Hore! Barang donasi sedang dalam perjalanan menuju alamatmu. Kamu bisa melacak kurir sekarang.';
                break;
                
            case 'new_request':
                $title = 'Ada Request Masuk';
                $message = 'Seseorang telah mengajukan permintaan untuk barang yang kamu donasikan. Segera berikan respon.';
                break;

            default:
                $title = 'Notifikasi Baru';
                $message = 'Kamu menerima pembaruan status baru pada aktivitas donasi kamu.';
                break;
        }

        return [
            'title'      => $title,
            'message'    => $message,
            'type'       => $type,
            'related_id' => fake()->numberBetween(1, 10),
            // Lebih rapi pakai boolean asli jika kolom di database bertipe boolean/tinyint
            'is_read'    => fake()->boolean(20), // 20% kemungkinan sudah dibaca (0 atau 1)
            'user_id'    => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}
