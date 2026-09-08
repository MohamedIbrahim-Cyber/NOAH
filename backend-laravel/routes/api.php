<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'service' => 'Noah Academy API'
    ]);
});

Route::get('/user', function (Request $request) {
    return response()->json([
        'message' => 'Noah Academy API Authenticated Endpoint',
        'user' => $request->user()
    ]);
});

Route::post('/auth/signup', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'message' => 'Signup endpoint reached',
        'data' => $request->all()
    ], 200);
});

Route::post('/auth/login', function (Request $request) {
    return response()->json([
        'status' => 'success',
        'message' => 'Login endpoint reached'
    ], 200);
});
