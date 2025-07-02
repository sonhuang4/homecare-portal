# -------------------------------------
# Build assets with Vite (Node)
# -------------------------------------
FROM node:20-alpine as node-builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
COPY resources/ ./resources

RUN npm install && npm run build

# -------------------------------------
# Laravel App (PHP + Apache)
# -------------------------------------
FROM php:8.2-apache

WORKDIR /var/www/html

# Enable Apache rewrite module
RUN a2enmod rewrite

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    zip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Laravel source code
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Fix permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Apache config for Laravel
RUN echo '<IfModule dir_module>\n  DirectoryIndex index.php index.html\n</IfModule>' > /etc/apache2/conf-available/laravel.conf && \
    a2enconf laravel && \
    echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Copy built assets from node-builder
COPY --from=node-builder /app/public/build ./public/build

EXPOSE 80
