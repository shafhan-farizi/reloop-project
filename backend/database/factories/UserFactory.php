<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();
        $bio = fake()->randomElement([
            "Halo! Saya {$name}. Senang bisa bergabung di platform donasi ini untuk saling berbagi dengan sesama.",
            "Fokus pada misi kemanusiaan dan penyaluran barang layak pakai untuk masyarakat yang membutuhkan.",
            "Mari bersama-sama memperpanjang manfaat barang di sekitar kita. Hubungi saya jika tertarik dengan barang donasi saya.",
            "Pengguna aktif yang ingin berkontribusi dalam gerakan sirkular ekonomi lewat aksi donasi sosial.",
            "Berbagi tidak akan pernah membuat kita berkurang. Salam kenal semuanya!"
        ]);

        return [
            'username'          => fake()->unique()->userName(),
            'name'              => $name,
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => static::$password ??= Hash::make('password123'),
            'role'              => 'user',
            'is_active'         => 1,
            'phone'             => fake()->phoneNumber(),
            'address'           => fake()->address(),
            'profile_photo'     => 'uploads/profiles/default-user.webp',
            'bio'               => $bio,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
