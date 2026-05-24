<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShipmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'courier'          => $this->courier,
            'tracking_number'  => $this->tracking_number,
            'cod_amount'       => $this->cod_amount,
            'status'           => $this->status,
            'shipped_at'       => $this->shipped_at?->toISOString(),
            'delivered_at'     => $this->delivered_at?->toISOString(),

            // feedback — hanya muncul kalau sudah diisi
            'rating'           => $this->rating,
            'feedback_message' => $this->feedback_message,
            'feedback_images'  => collect($this->feedback_images ?? [])->map(
                fn($path) => asset('storage/' . $path)
            )->values(),

            // relasi
            'request' => new RequestResource($this->whenLoaded('request')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}