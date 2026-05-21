<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

class RequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'purpose' => 'Butuh untuk keperluan kuliah dan belajar kelompok di kosan.',
            'urgency_level' => fake()->randomElement(['rendah', 'sedang', 'tinggi']),
            'delivery_address' => fake()->address(),
            'recipient_phone' => fake()->phoneNumber(),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected', 'cancelled']),
            'rejection_reason' => fake()->optional()->sentence(), // Kadang null, kadang ada isinya
            'item_id' => Item::inRandomOrder()->first()?->id ?? Item::factory(),
            'requester_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}