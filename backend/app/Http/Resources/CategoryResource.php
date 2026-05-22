<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'items_count' => $this->whenCounted('items'), // muncul kalau withCount() dipanggil
            'created_at'  => $this->created_at?->toISOString(),
        ];
    }
}
