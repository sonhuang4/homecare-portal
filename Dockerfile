# ----------------------------------------
# Stage 1: Build PHP + Node + Composer
# ----------------------------------------
FROM php:8.2-cli AS build

WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    unzip git curl gnupg libzip-dev libpng-dev libonig-dev libxml2-dev libsqlite3-dev zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy source code
COPY . .

# Create dummy .env to avoid Laravel crashing during build
RUN cp .env.example .env || touch .env

# Set permissions for Laravel folders
RUN mkdir -p storage bootstrap/cache && chmod -R 775 storage bootstrap/cache

# Install backend dependencies (no dev)
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --no-scripts

# Install Node 18 and build assets
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# ----------------------------------------
# Stage 2: Apache + PHP runtime
# ----------------------------------------
FROM php:8.2-apache

# Enable Apache rewrite + install PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev libsqlite3-dev zip git unzip \
    libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip fileinfo mbstring bcmath

RUN a2enmod rewrite

# Set Laravel public folder as the Apache root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

WORKDIR /var/www/html

# Copy build result from stage 1
COPY --from=build /var/www /var/www/html

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Set permissions for Laravel directories
RUN chown -R www-data:www-data storage bootstrap/cache database || true

# Run startup script (create SQLite, migrate, seed, start Apache)
CMD ["bash", "/start.sh"]
