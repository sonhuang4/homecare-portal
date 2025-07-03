#!/bin/bash

# Create SQLite DB if not exists
if [ ! -f database/database.sqlite ]; then
  touch database/database.sqlite
fi

# Laravel setup
php artisan config:clear
php artisan migrate --force
php artisan db:seed --force

# Start Apache
exec apache2-foreground
