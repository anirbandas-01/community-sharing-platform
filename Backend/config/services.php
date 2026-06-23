<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*Gemini */
    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
    ],  
    /* Platform admin support inbox — where "Contact Admin" / "Mail Admin" emails go */
    'admin_support' => [
        'email' => env('ADMIN_SUPPORT_EMAIL', env('MAIL_FROM_ADDRESS', 'admin@communitysharing.com')),
        'name'  => env('ADMIN_SUPPORT_NAME', 'CommunitySharing Admin'),
    ],
];
