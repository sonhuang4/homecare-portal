# -------------------------------------
# Build stage for Vite (Node)
# -------------------------------------
FROM node:20-alpine as node-builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY resources/ resources/
COPY vite.config.js ./

RUN npm run build

# -------------------------------------
# Laravel App (PHP + Apache)
# -------------------------------------
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Enable Apache rewrite module
RUN a2enmod rewrite

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    zip \
    curl \
    git \
    && docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy app files
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy Vite build assets
COPY --from=node-builder /app/public/build public/build

# Set correct permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Set Laravel-specific Apache config
RUN echo '<IfModule dir_module>\n  DirectoryIndex index.php index.html\n</IfModule>' > /etc/apache2/conf-available/laravel.conf && \
    a2enconf laravel

# Set document root
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

EXPOSE 80
