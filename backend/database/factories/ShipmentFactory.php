<?php

namespace Database\Factories;

use App\Models\Request as ItemRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'courier' => fake()->randomElement(['JNE', 'J&T', 'SiCepat', 'Anteraja']),
            'tracking_number' => strtoupper(fake()->randomLetter() . fake()->randomLetter()) . fake()->numerify('##########'), // Contoh: JX1234567890
            'cod_amount' => fake()->randomElement([15000, 20000, 25000]),
            'status' => fake()->randomElement(['preparing', 'in_transit', 'delivered']),
            'shipped_at' => fake()->dateTimeBetween('-1 week', 'now'),
            'delivered_at' => fake()->dateTimeBetween('now', '+1 week'),
            'rating' => fake()->numberBetween(4, 5), // Rata-rata rating bintang 4-5
            'feedback_message' => 'Terima kasih banyak kak, barangnya masih bagus banget sesuai deskripsi!',
            'feedback_images' => ['uploads/feedback/proof.jpg'],
            'request_id' => ItemRequest::inRandomOrder()->first()?->id ?? ItemRequest::factory(),
        ];
    }
}