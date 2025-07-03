# ----------------------------------------
# Stage 1: PHP + Composer + Vite Build
# ----------------------------------------
FROM php:8.2-cli AS build

WORKDIR /var/www

# Install system dependencies & PHP extensions required by Laravel
RUN apt-get update && apt-get install -y \
    curl unzip git gnupg libzip-dev libpng-dev libonig-dev libxml2-dev libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip fileinfo mbstring bcmath

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy app source
COPY . .

# ✅ Now Composer will succeed because extensions are ready
RUN composer install --optimize-autoloader --no-dev

# Install Node 18 and build frontend assets
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# ----------------------------------------
# Stage 2: Apache + PHP Runtime
# ----------------------------------------
FROM php:8.2-apache

# Install PHP extensions for runtime
RUN apt-get update && apt-get install -y \
    libzip-dev libsqlite3-dev unzip git libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip fileinfo mbstring bcmath

# Enable Apache rewrite
RUN a2enmod rewrite

# Set Apache public root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

WORKDIR /var/www/html

# Copy app from build stage
COPY --from=build /var/www /var/www/html

# Create SQLite DB and fix permissions
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data storage bootstrap/cache database

# Start Laravel + Apache
CMD bash -c "php artisan migrate --force && php artisan db:seed --force && exec apache2-foreground"
