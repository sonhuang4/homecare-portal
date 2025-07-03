# ----------------------------------------
# Stage 1: Build (PHP + Composer + Node)
# ----------------------------------------
FROM php:8.2-cli AS build

WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl unzip git gnupg

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy app source code
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Install Node.js 18 and build assets
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# ----------------------------------------
# Stage 2: Runtime (Apache + PHP + Laravel)
# ----------------------------------------
FROM php:8.2-apache

# Install required PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip

# Enable Apache rewrite
RUN a2enmod rewrite

# Set Laravel's public folder as document root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

WORKDIR /var/www/html

# Copy built app from build stage
COPY --from=build /var/www /var/www/html

# Create SQLite file and set correct permissions
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data storage bootstrap/cache database

# Run migrations and seeders, then start Apache
CMD bash -c "php artisan migrate --force && php artisan db:seed --force && exec apache2-foreground"
