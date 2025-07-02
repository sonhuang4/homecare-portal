# -------------------------------------
# Build stage for Vite (Node)
# -------------------------------------
FROM node:20-alpine as node-builder

WORKDIR /app

# Install dependencies and build frontend
COPY package*.json vite.config.js ./
COPY resources/ resources/
RUN npm install
RUN npm run build

# -------------------------------------
# Laravel App (PHP + Apache)
# -------------------------------------
FROM php:8.2-apache

WORKDIR /var/www/html

# Enable Apache rewrite module
RUN a2enmod rewrite

# Install system dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    zip \
    && docker-php-ext-install zip pdo pdo_mysql

# Install Composer (from official composer image)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy entire Laravel app
COPY . .

# Install PHP dependencies with Composer
RUN composer install --no-dev --optimize-autoloader

# Set correct permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Apache config for Laravel
RUN echo '<IfModule dir_module>\n  DirectoryIndex index.php index.html\n</IfModule>' > /etc/apache2/conf-available/laravel.conf && \
    a2enconf laravel

# Set Laravel public as DocumentRoot
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Copy frontend build from Node stage
COPY --from=node-builder /app/public/build ./public/build

# Expose port
EXPOSE 80
