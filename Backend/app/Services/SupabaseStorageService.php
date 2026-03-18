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
    protected $serviceKey; // Use service key, not anon key
    protected $bucket;

    public function __construct()
    {
        $this->url = config('supabase.url');
        $this->serviceKey = config('supabase.service_key'); // Changed to service_key
        $this->bucket = config('supabase.storage_bucket');
    }

    public function upload(UploadedFile $file, string $folder = 'profiles')
    {
        try {
            // Generate unique filename
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '_' . Str::random(10) . '.' . $extension;
            $path = $folder . '/' . $filename;

            // Get file contents as binary
            $fileContents = file_get_contents($file->getRealPath());

            // Upload using SERVICE_ROLE key (bypasses RLS policies)
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->serviceKey,  // Service key
                'apikey' => $this->serviceKey,                      // Service key
                'Content-Type' => $file->getMimeType(),
            ])
            ->withBody($fileContents, $file->getMimeType())
            ->post("{$this->url}/storage/v1/object/{$this->bucket}/{$path}");

            Log::info('Supabase upload attempt', [
                'url' => "{$this->url}/storage/v1/object/{$this->bucket}/{$path}",
                'status' => $response->status(),
                'bucket' => $this->bucket,
                'path' => $path,
                'mime_type' => $file->getMimeType(),
            ]);

            if ($response->successful()) {
                return $this->getPublicUrl($path);
            }

            // Enhanced error logging
            Log::error('Supabase upload failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'path' => $path,
                'bucket' => $this->bucket,
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
                'Authorization' => 'Bearer ' . $this->serviceKey,
                'apikey' => $this->serviceKey,
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