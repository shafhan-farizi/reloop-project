<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    /**
     * Kirim notifikasi ke satu user.
     *
     * @param  int         $userId     — penerima notifikasi
     * @param  string      $type       — new_request | request_approved | request_rejected | item_shipped | item_delivered
     * @param  string      $title
     * @param  string      $message
     * @param  int|null    $relatedId  — id dari resource terkait (request_id, shipment_id, dll)
     */
    public function send(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?int $relatedId = null
    ): void {
        Notification::create([
            'user_id'    => $userId,
            'type'       => $type,
            'title'      => $title,
            'message'    => $message,
            'related_id' => $relatedId,
            'is_read'    => false,
        ]);
    }
}