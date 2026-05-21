<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        // Pakai kata acak unik buat nama kategori donasi
        return [
            'name' => fake()->unique()->randomElement(['Elektronik', 'Pakaian', 'Buku & Alat Tulis', 'Mainan Anak', 'Perabotan']),
            'description' => fake()->sentence(),
        ];
    }
}