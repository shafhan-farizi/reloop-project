<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('description');
            $table->enum('condition', ['baru', 'seperti baru', 'layak pakai']); // Sesuaikan enum-mu
            $table->string('location', 100);
            $table->json('images');
            $table->enum('shipping_type', ['free', 'paid']);
            $table->enum('status', ['available', 'reserved', 'donated'])->default('available');
            $table->foreignId('donor_id')->nullable()->constrained('users')->nullOnDelete(); // Histori aman
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete(); // Proteksi kategori   
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
