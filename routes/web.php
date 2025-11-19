<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Arahkan root "/" ke halaman login
Route::get('/', function () {
    return redirect()->route('login');
});

// Dashboard, hanya bisa diakses setelah login & email terverifikasi
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Group route untuk user yang sudah login
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
