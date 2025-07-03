# Stage 1: Composer + Vite Build
FROM composer:latest AS build

WORKDIR /var/www

# Copy app source
COPY . .

# PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Node for Vite
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# Stage 2: Apache + PHP Runtime
FROM php:8.2-apache

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip

# Enable Apache rewrite
RUN a2enmod rewrite

# Set Laravel public dir
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

WORKDIR /var/www/html

# Copy built files from build stage
COPY --from=build /var/www /var/www/html

# Auto-create SQLite DB file and set permissions
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data storage bootstrap/cache database

# Run migrations and seeders on container start
CMD php artisan migrate --force && php artisan db:seed --force && apache2-foreground
