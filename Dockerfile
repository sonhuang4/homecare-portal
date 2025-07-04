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
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    pkg-config \
    zip \
    unzip \
    curl \
    git \
 && docker-php-ext-configure pdo_sqlite \
 && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

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

# Laravel permissions
RUN mkdir -p /var/www/storage \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/www

# Expose HTTP port expected by Render
EXPOSE 10000

# Start Laravel using artisan serve
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
