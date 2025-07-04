# ---- Base PHP image ----
FROM php:8.2-fpm

# ---- System dependencies ----
RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    git \
    libonig-dev \
    libxml2-dev \
    sqlite3 \
    libsqlite3-dev \
    npm \
    nodejs \
    && docker-php-ext-install pdo pdo_sqlite

# ---- Install Composer ----
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ---- Set working directory ----
WORKDIR /var/www/html

# ---- Copy project files ----
COPY . .

# ---- Install PHP deps ----
RUN composer install --no-dev --optimize-autoloader

# ---- Build frontend ----
RUN npm install && npm run build

# ---- Set permissions ----
RUN chmod -R 775 storage bootstrap/cache

# ---- Serve app ----
CMD php artisan serve --host=0.0.0.0 --port=10000
