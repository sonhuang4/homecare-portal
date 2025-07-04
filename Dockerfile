# Use official PHP FPM image
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libonig-dev libxml2-dev sqlite3 libsqlite3-dev nodejs npm \
    && docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy app files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Build React assets
RUN npm install && npm run build

# Set permissions for Laravel
RUN chmod -R 775 storage bootstrap/cache

# Serve Laravel app
CMD php artisan serve --host=0.0.0.0 --port=10000
