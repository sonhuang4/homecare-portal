#!/bin/bash

# Ensure SQLite DB exists
if [ ! -f "database/database.sqlite" ]; then
  echo "Creating SQLite DB file..."
  touch database/database.sqlite
fi

# Set correct permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true

# Cache Laravel config and routes
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (optional, if using DB)
php artisan migrate --force

# Start Laravel server
php -S 0.0.0.0:10000 -t public
