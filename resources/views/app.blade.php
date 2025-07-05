<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="{{ asset('favicon.png') }}" type="image/png">

    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet">

    {{-- Laravel routes --}}
    @routes

    {{-- Vite React Refresh (dev only) --}}
    @viteReactRefresh

    {{-- Vite Assets (dev + production) --}}
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])

    {{-- Inertia Head --}}
    @inertiaHead
</head>
<body class="font-sans antialiased text-gray-900 bg-white dark:bg-black dark:text-white">
    @inertia
</body>
</html>
