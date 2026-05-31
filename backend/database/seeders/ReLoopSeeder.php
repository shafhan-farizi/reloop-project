<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Item;
use App\Models\Request as ItemRequest;
use App\Models\Shipment;
use App\Models\Notification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ReLoopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // memindahkan gambar dummy dari database/seeders/images ke storage/app/public
        $db_path = 'seeders/images';
        $strg_path = 'app/public';
        
        // User
        Storage::disk('public')->makeDirectory('uploads/profiles');

        $users = ['admin', 'budi', 'user'];

        foreach($users as $user) {
            $fileName = "default-{$user}.webp";
            $source = database_path($db_path . '/users/' . $fileName);
            $destination = storage_path($strg_path . '/uploads/profiles/' . $fileName);

            File::copy($source, $destination);
        }

        // Item & Buat direktori baru feedback
        Storage::disk('public')->makeDirectory('uploads/items');
        Storage::disk('public')->makeDirectory('uploads/feedback'); 

        $itemNames = ['kaos-uniqlo', 'blender-philips', 'laptop-asus-bekas', 'novel-tereliye'];

        foreach($itemNames as $item) {
            foreach([1,2,3] as $index) {
                $fileName = "items/{$item}-{$index}.webp";
                $source = database_path($db_path . '/' . $fileName);
                $destination = storage_path($strg_path . '/uploads/' . $fileName);
                File::copy($source, $destination);
            }
        }

        // 1. Pembuatan Akun Akses Manual
        User::create([
            'username' => 'admin_reloop',
            'name' => 'Admin ReLoop',
            'email' => 'admin@reloop.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => 1,
            'profile_photo' => 'uploads/profiles/default-admin.webp'
        ]);

        User::create([
            'username' => 'user_demo',
            'name' => 'Budi Cortisol',
            'email' => 'budi@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => 1,
            'profile_photo' => 'uploads/profiles/default-budi.webp'
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
