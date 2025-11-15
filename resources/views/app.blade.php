<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    @routes {{-- Ziggy --}}
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="h-full bg-gray-50 text-gray-900 antialiased">
    @inertia

    {{-- Navbar --}}
    <nav class="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

            {{-- Logo --}}
            <a href="/" class="text-xl font-bold text-indigo-600">Todos App</a>

            {{-- Desktop Menu --}}
            <div class="hidden md:flex items-center gap-6">
                <a href="{{ route('dashboard') }}" class="hover:text-indigo-600">Dashboard</a>

                @auth
                    {{-- User Dropdown --}}
                    <div class="relative">
                        <button id="user-btn" class="flex items-center gap-2">
                            <span>{{ auth()->user()->name }}</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                 viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div id="user-menu"
                             class="hidden absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md py-1">
                            
                            <a href="{{ route('dashboard') }}" class="block px-4 py-2 text-sm hover:bg-gray-50">
                                Dashboard
                            </a>

                            <form method="POST" action="{{ route('auth.logout') }}">
                                @csrf
                                <button type="submit"
                                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                @endauth

                @guest
                    <a href="{{ route('auth.login') }}" class="text-indigo-600 font-medium hover:underline">Login</a>
                @endguest
            </div>

            {{-- Mobile Menu Button --}}
            <button id="menu-toggle" class="md:hidden">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
        </div>

        {{-- Mobile Menu --}}
        <div id="mobile-menu" class="hidden md:hidden border-t bg-white">
            <a href="{{ route('dashboard') }}" class="block px-4 py-3 hover:bg-gray-50">Dashboard</a>

            @auth
                <form method="POST" action="{{ route('auth.logout') }}" class="border-t">
                    @csrf
                    <button type="submit"
                            class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50">
                        Logout
                    </button>
                </form>
            @endauth

            @guest
                <a href="{{ route('auth.login') }}" class="block px-4 py-3 hover:bg-gray-50">Login</a>
            @endguest
        </div>
    </nav>

    <script>
        // toggle user dropdown
        document.getElementById('user-btn')?.addEventListener('click', () => {
            document.getElementById('user-menu').classList.toggle('hidden');
        });

        // toggle mobile menu
        document.getElementById('menu-toggle')?.addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    </script>
</body>
</html>
