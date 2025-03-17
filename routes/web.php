<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BroadcastController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Broadcasting test routes
Route::get('/broadcast', [BroadcastController::class, 'index'])->name('broadcast.index');
Route::post('/broadcast', [BroadcastController::class, 'broadcast'])->name('broadcast.send');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
