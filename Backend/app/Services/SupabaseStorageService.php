<?php
// File: Backend/app/Services/SupabaseStorageService.php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;


class SupabaseStorageService
{
    protected $url;
    protected $key;
    protected $bucket;

    public function __construct()
    {
        $this->url = config('supabase.url');
        $this->key = config('supabase.key');
        $this->bucket = config('supabase.storage_bucket');
    }

    public function upload(UploadedFile $file, string $folder = 'profiles')
    {
        try {
            // Generate unique filename
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '_' . Str::random(10) . '.' . $extension;
            $path = $folder . '/' . $filename;

            // ✅ FIX: Get file contents as BINARY, not JSON
            $fileContents = file_get_contents($file->getRealPath());

            // ✅ FIX: Use attach() instead of sending raw body
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->key,
                'Content-Type' => $file->getMimeType(),
            ])
            ->withBody($fileContents, $file->getMimeType())  // ✅ Changed this
            ->post("{$this->url}/storage/v1/object/{$this->bucket}/{$path}");

            if ($response->successful()) {
                return $this->getPublicUrl($path);
            }

            // Better error logging
            Log::error('Supabase upload failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'path' => $path
            ]);

            throw new \Exception('Upload failed: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Supabase upload error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getPublicUrl(string $path)
    {
        return "{$this->url}/storage/v1/object/public/{$this->bucket}/{$path}";
    }

    public function delete(string $path)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->key,
            ])->delete(
                "{$this->url}/storage/v1/object/{$this->bucket}/{$path}"
            );

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Supabase delete error: ' . $e->getMessage());
            return false;
        }
    }

    public function extractPath(string $url)
    {
        if (empty($url)) {
            return null;
        }

        $pattern = "/\/object\/public\/{$this->bucket}\/(.*)/";
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1];
        }

        return null;
    }
}