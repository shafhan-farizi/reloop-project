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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('courier', 50)->nullable();
            $table->string('tracking_number', 100)->nullable();
            $table->decimal('cod_amount', 10, 2)->nullable();
            $table->enum('status', ['preparing', 'in_transit', 'delivered'])->default('preparing');
            $table->dateTime('shipped_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->tinyInteger('rating')->nullable();
            $table->text('feedback_message')->nullable();
            $table->json('feedback_images')->nullable();
            $table->foreignId('request_id')->constrained('requests')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
