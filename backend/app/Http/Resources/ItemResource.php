<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'description'   => $this->description,
            'condition'     => $this->condition,
            'location'      => $this->location,
            'shipping_type' => $this->shipping_type,
            'status'        => $this->status,

            // images sudah di-cast array di model, tinggal map jadi full URL
            'images' => collect($this->images ?? [])->map(
                fn($path) => asset('storage/' . $path)
            )->values(),

            // relasi — muncul hanya kalau di-load (pakai whenLoaded)
            'donor'    => new UserResource($this->whenLoaded('donor')),
            'category' => new CategoryResource($this->whenLoaded('category')),

            'requests_count' => $this->whenCounted('requests'),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
