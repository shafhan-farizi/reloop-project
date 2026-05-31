<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Item;
use App\Models\Request as ItemRequest;
use App\Models\Shipment;
use App\Models\Notification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ReLoopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Pembuatan Akun Akses Manual
        User::create([
            'username' => 'admin_reloop',
            'name' => 'Admin ReLoop',
            'email' => 'admin@reloop.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => 1,
        ]);

        User::create([
            'username' => 'user_demo',
            'name' => 'Budi Cortisol',
            'email' => 'budi@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => 1,
        ]);

        // 2. Pembuatan Data Otomatis Menggunakan Model Factory
        User::factory()->count(10)->create();
        Category::factory()->count(5)->create();
        Item::factory()->count(15)->create();
        ItemRequest::factory()->count(20)->create();
        Shipment::factory()->count(10)->create();
        Notification::factory()->count(15)->create();
    }
}