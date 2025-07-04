# ======================
# 1. Build Frontend (Vite)
# ======================
FROM node:18 as frontend

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY resources ./resources
COPY public ./public
COPY tailwind.config.js postcss.config.js vite.config.js ./
RUN npm run build

# ======================
# 2. Build Backend (Laravel)
# ======================
FROM php:8.2-fpm

# System dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip unzip curl git sqlite3 \
 && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . .

# Copy built assets from frontend
COPY --from=frontend /app/public ./public
COPY --from=frontend /app/resources ./resources

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www \
 && chmod -R 755 /var/www/storage

# Define startup (you can override this in Render dashboard)
CMD ["php-fpm"]
