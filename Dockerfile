# ----------------------------------------
# Stage 1: Build Stage - PHP + Composer + Node
# ----------------------------------------
FROM php:8.2-cli AS build

WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl unzip zip libzip-dev libpng-dev libonig-dev libxml2-dev libsqlite3-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite zip bcmath mbstring fileinfo

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy source code
COPY . .

# Allow Composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Install PHP dependencies (no-dev)
RUN composer install --no-dev --optimize-autoloader

# Install Node 18 and build frontend
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# ----------------------------------------
# Stage 2: Runtime - Apache + PHP
# ----------------------------------------
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install Apache dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev libsqlite3-dev unzip git libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite zip fileinfo mbstring bcmath

# Enable Apache rewrite
RUN a2enmod rewrite

# Set Laravel public folder as Apache root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# Copy compiled app from build stage
COPY --from=build /var/www /var/www/html

# Fix permissions
RUN mkdir -p storage bootstrap/cache database && \
    chown -R www-data:www-data storage bootstrap/cache database && \
    chmod -R 775 storage bootstrap/cache database && \
    touch database/database.sqlite

# Final CMD: migrate then serve
CMD php artisan migrate --force && \
    php artisan db:seed --force && \
    exec apache2-foreground
