# ---- 1. Build frontend (React + Vite + Tailwind) ----
FROM node:18 AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY resources resources
COPY public public
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

RUN npm run build


# ---- 2. Laravel backend (PHP + SQLite) ----
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libsqlite3-dev \
 && docker-php-ext-configure pdo_sqlite \
 && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy Laravel app
COPY . .

# Ensure SQLite DB exists and is writable
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chmod -R 775 database && \
    chown -R www-data:www-data database

# Ensure .env exists (Render injects real values)
RUN touch .env

# Copy built frontend
COPY --from=frontend /app/public/build ./public/build
COPY --from=frontend /app/resources ./resources

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Laravel permissions
RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data .

# Expose Render port
EXPOSE 10000

# Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
