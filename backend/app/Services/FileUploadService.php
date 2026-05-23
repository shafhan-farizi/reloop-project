<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * Upload satu file dan return path-nya (relatif ke storage/app/public).
     *
     * @param  UploadedFile  $file
     * @param  string  $folder  — misal: 'uploads/profiles', 'uploads/items'
     * @return string           — path yang disimpan di DB
     */
    public function upload(UploadedFile $file, string $folder): string
    {
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $file->storeAs($folder, $filename, 'public');

        return $folder . '/' . $filename;
    }

    /**
     * Upload banyak file sekaligus, return array of paths.
     * Dipakai untuk kolom 'images' di items dan 'feedback_images' di shipments.
     *
     * @param  UploadedFile[]  $files
     * @param  string  $folder
     * @return string[]
     */
    public function uploadMany(array $files, string $folder): array
    {
        return array_map(
            fn($file) => $this->upload($file, $folder),
            $files
        );
    }

    /**
     * Hapus file lama dari storage.
     * Dipanggil sebelum upload file baru supaya tidak numpuk.
     *
     * @param  string|null  $path  — path yang tersimpan di DB
     */
    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
