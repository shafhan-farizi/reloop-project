<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->randomElement(['Kaos Polos Uniqlo', 'Laptop Asus Bekas', 'Buku Novel Tere Liye', 'Blender Philips']),
            'description' => fake()->paragraph(),
            'condition' => fake()->randomElement(['baru', 'seperti baru', 'layak pakai']),
            'location' => fake()->randomElement(['Jakarta Pusat', 'Depok', 'Bogor', 'Bandung', 'Surabaya']),
            // Kolom images tipenya JSON, jadi kita kasih array isi path gambar dummy
            'images' => [
                'uploads/items/dummy1.jpg',
                'uploads/items/dummy2.jpg'
            ],
            'shipping_type' => fake()->randomElement(['free', 'paid']),
            'status' => fake()->randomElement(['available', 'reserved', 'donated']),
            // Otomatis ngambil ID acak dari data user dan kategori yang ada
            'donor_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
        ];
    }
}