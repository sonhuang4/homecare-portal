<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'Homecare Portal') }}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        @routes
        @if(app()->environment('local'))
            @vite(['resources/js/app.js'])
        @else
            @vite(['resources/js/app.js'])
        @endif
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>