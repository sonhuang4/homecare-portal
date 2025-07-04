# ---- 1. Build frontend ----
FROM node:18 AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY resources resources
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY public public

RUN npm run build

# ---- 2. Build Laravel app ----
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    sqlite3 \
    git \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy Laravel app
COPY . .

# Copy built frontend
COPY --from=frontend /app/public ./public
COPY --from=frontend /app/resources ./resources

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage

# Start command is defined in Render dashboard (leave empty here)
