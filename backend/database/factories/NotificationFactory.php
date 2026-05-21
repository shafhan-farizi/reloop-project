<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->randomElement(['Permintaan Disetujui!', 'Barang Telah Dikirim', 'Ada Request Masuk']),
            'message' => fake()->sentence(),
            'type' => fake()->randomElement(['request_approved', 'item_shipped', 'new_request']),
            'related_id' => fake()->numberBetween(1, 10),
            'is_read' => fake()->randomElement([0, 1]),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}