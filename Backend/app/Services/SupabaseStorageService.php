<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

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

    /**
     * Upload a file to Supabase Storage
     */
    public function upload(UploadedFile $file, string $folder = 'profiles')
    {
        try {
            // Generate unique filename
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '_' . Str::random(10) . '.' . $extension;
            $path = $folder . '/' . $filename;

            // Get file contents
            $fileContents = file_get_contents($file->getRealPath());

            // Upload to Supabase
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->key,
                'Content-Type' => $file->getMimeType(),
            ])->post(
                "{$this->url}/storage/v1/object/{$this->bucket}/{$path}",
                $fileContents
            );

            if ($response->successful()) {
                return $this->getPublicUrl($path);
            }

            throw new \Exception('Upload failed: ' . $response->body());
        } catch (\Exception $e) {
            \Log::error('Supabase upload error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get public URL for a file
     */
    public function getPublicUrl(string $path)
    {
        return "{$this->url}/storage/v1/object/public/{$this->bucket}/{$path}";
    }

    /**
     * Delete a file from Supabase Storage
     */
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
            \Log::error('Supabase delete error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Extract path from full URL
     */
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