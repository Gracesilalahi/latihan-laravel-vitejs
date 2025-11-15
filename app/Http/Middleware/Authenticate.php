<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param \Illuminate\Http\Request $request
     * @return string|null
     */
    protected function redirectTo(Request $request): ?string
    {
        // Jika permintaan bukan dari AJAX (yaitu, permintaan web biasa),
        // lakukan redirect.
        if (! $request->expectsJson()) {
            // Kita mengubah 'login' (default Laravel) menjadi 'auth.login', 
            // sesuai dengan nama rute login yang sudah Anda definisikan di web.php.
            return route('auth.login'); 
        }

        return null;
    }
}