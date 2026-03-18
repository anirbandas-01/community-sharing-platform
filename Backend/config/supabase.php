<?php

return [
    'url' => env('SUPABASE_URL'),
    'key' => env('SUPABASE_SERVICE_KEY'),  // Changed this line
    'service_key' => env('SUPABASE_SERVICE_KEY'),
    'storage_bucket' => env('SUPABASE_STORAGE_BUCKET', 'profile-images'),
];