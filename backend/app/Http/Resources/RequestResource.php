<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'purpose'          => $this->purpose,
            'urgency_level'    => $this->urgency_level,
            'delivery_address' => $this->delivery_address,
            'recipient_phone'  => $this->recipient_phone,
            'status'           => $this->status,
            'rejection_reason' => $this->rejection_reason,

            // relasi — muncul hanya kalau di-load
            'item'      => new ItemResource($this->whenLoaded('item')),
            'requester' => new UserResource($this->whenLoaded('requester')),
            'shipment'  => new ShipmentResource($this->whenLoaded('shipment')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}