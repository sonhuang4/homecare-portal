#!/bin/bash

# Create SQLite DB if not exists
mkdir -p database
touch database/database.sqlite

# Cache config and routes
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Migrate DB
php artisan migrate --force

# Start PHP server
php -S 0.0.0.0:10000 -t public
