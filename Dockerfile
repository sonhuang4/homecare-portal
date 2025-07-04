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
WORKDIR /var/www/html

# Copy Laravel app
COPY . .

# ✅ Add dummy .env so artisan works
RUN touch .env

# ✅ Fix: Create SQLite file in expected location
RUN mkdir -p database && touch database/database.sqlite

# Copy built frontend
COPY --from=frontend /app/public ./public
COPY --from=frontend /app/resources ./resources

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set permissions
RUN mkdir -p storage \
 && chmod -R 775 storage bootstrap/cache \
 && chown -R www-data:www-data .

# ✅ Expose required port
EXPOSE 10000

# ✅ Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
