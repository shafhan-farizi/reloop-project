<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShipmentTrackingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
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

            // relasi
            'requester' =>  $this->request?->requester ? new UserShipmentTrackingResource($this->request?->requester) : null,
            'item' => $this->request?->item ? new ItemResource($this->request?->item) : null,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
