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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('message');
            $table->string('type', 50); // Misal: 'request_approved', 'item_shipped', dll.
            $table->unsignedBigInteger('related_id')->nullable(); // Relasi ID bebas (bisa request_id atau item_id)
            $table->tinyInteger('is_read')->default(0); // 0 = belum dibaca, 1 = sudah dibaca
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
