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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->text('purpose');
            $table->enum('urgency_level', ['rendah', 'sedang', 'tinggi']);
            $table->text('delivery_address');
            $table->string('recipient_phone', 20);
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('item_id')->constrained('items')->cascadeOnDelete(); // Barang ilang = semua request ke barang akan hilang
            $table->foreignId('requester_id')->nullable()->constrained('users')->nullOnDelete(); // Histori penerima aman
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
