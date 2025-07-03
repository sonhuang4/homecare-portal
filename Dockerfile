# ----------------------------------------
# Stage 1: PHP + Composer + Vite Build
# ----------------------------------------
FROM php:8.2-cli AS build

WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl unzip git gnupg

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy Laravel source code
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Install Node.js 18 and build assets
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# ----------------------------------------
# Stage 2: Apache + Laravel Runtime
# ----------------------------------------
FROM php:8.2-apache

# Install system & PHP extensions (includes libsqlite3-dev fix)
RUN apt-get update && apt-get install -y \
    libzip-dev libsqlite3-dev unzip git libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip

# Enable Apache rewrite
RUN a2enmod rewrite

# Set Laravel public folder as doc root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# Set working directory
WORKDIR /var/www/html

# Copy from build stage
COPY --from=build /var/www /var/www/html

# Create SQLite file + fix permissions
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data storage bootstrap/cache database

# Run migrations + seeders, then Apache
CMD bash -c "php artisan migrate --force && php artisan db:seed --force && exec apache2-foreground"
