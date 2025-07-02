# -------------------------------------
# Build stage for Vite (Node)
# -------------------------------------
FROM node:20-alpine as node-builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# -------------------------------------
# Laravel App (PHP + Apache)
# -------------------------------------
FROM php:8.2-apache

WORKDIR /var/www/html

# Enable Apache rewrite
RUN a2enmod rewrite

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    curl \
    git \
    zip \
    libxml2-dev \
    && docker-php-ext-install \
    bcmath \
    pdo_mysql \
    zip \
    mbstring \
    tokenizer \
    ctype \
    fileinfo

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy app files
COPY . .

# Run Composer
RUN composer install --no-dev --optimize-autoloader

# Set correct permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Apache config
RUN echo '<IfModule dir_module>\n  DirectoryIndex index.php index.html\n</IfModule>' > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Copy Vite build assets
COPY --from=node-builder /app/public/build ./public/build

EXPOSE 80
