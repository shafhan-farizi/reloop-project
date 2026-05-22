<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'address' => $this->address,
            'profile_photo' => $this->profile_photo ? asset('storage/' . $this->profile_photo) : null,
            'bio' => $this->bio,
            'is_active'     => (bool) $this->is_active,
            'created_at'    => $this->created_at?->toISOString(),
        ];
    }
}
