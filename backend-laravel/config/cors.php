<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Strictly configured for Nohe Academy. Rather than wide-open wildcard (*),
    | allowed origins are explicitly defined via environment variable with
    | secure production defaults, and credentials support enabled.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => array_filter(explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000,https://noheacademy.sa,https://app.noheacademy.sa'))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Authorization', 'Accept', 'X-Session-Token'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => true,

];
