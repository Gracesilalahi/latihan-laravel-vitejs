<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;

class AuthController extends Controller
{
    // 🟢 Halaman login
    public function login()
    {
        if (Auth::check()) {
            // ✅ PERBAIKAN: Gunakan redirect() standar Laravel untuk initial redirect/guard
            return redirect()->route('dashboard'); 
        }

        return Inertia::render('Auth/Login', [
            'success' => session('success'),
        ]);
    }

    // 🟢 Proses login
    public function postLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if (!Auth::attempt($credentials)) {
            return back()->withErrors([
                'email' => 'Email atau password salah.',
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        // ✅ PERBAIKAN: Gunakan redirect() standar Laravel setelah login
        return redirect()->route('dashboard');
    }

    // 🟢 Halaman register (opsional jika pakai controller lain)
    public function register()
    {
        if (Auth::check()) {
            // ✅ PERBAIKAN: Gunakan redirect() standar Laravel untuk initial redirect/guard
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/Register');
    }

    // 🟢 Proses register (opsional juga)
    public function postRegister(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);

        // ✅ PERBAIKAN: Gunakan redirect() standar Laravel setelah register
        return redirect()->route('dashboard');
    }

    // 🟢 Logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // ✅ Inertia::location untuk logout sudah benar, karena ini biasanya 
        // dipicu dari Inertia XHR request, bukan full page load.
        return Inertia::location(route('auth.login'));
    }
}