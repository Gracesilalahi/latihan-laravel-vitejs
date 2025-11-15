<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\TodoController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| 🏠 Default Redirect
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    // Langsung arahkan ke login page
    return redirect('/login');
});

/*
|--------------------------------------------------------------------------
| 🔐 Auth Routes
|--------------------------------------------------------------------------
*/
Route::controller(AuthController::class)->group(function () {
    Route::get('/login', 'login')->name('auth.login');
    Route::post('/login', 'postLogin')->name('auth.postLogin');
    Route::post('/logout', 'logout')->name('auth.logout');
});

/*
|--------------------------------------------------------------------------
| 🧍 Register Routes
|--------------------------------------------------------------------------
*/
Route::get('/register', [RegisteredUserController::class, 'create'])->name('auth.register');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('auth.postRegister');

/*
|--------------------------------------------------------------------------
| 🧭 Dashboard & Todos (Protected)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::prefix('todos')->name('todos.')->group(function () {
        Route::get('/', [TodoController::class, 'index'])->name('index');
        Route::get('/create', [TodoController::class, 'create'])->name('create');
        Route::post('/', [TodoController::class, 'store'])->name('store');
        Route::get('/{todo}/edit', [TodoController::class, 'edit'])->name('edit');
        Route::put('/{todo}', [TodoController::class, 'update'])->name('update');
        Route::delete('/{todo}', [TodoController::class, 'destroy'])->name('destroy');
    });
});
