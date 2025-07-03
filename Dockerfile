# ----------------------------------------
# Stage 1: Build (Composer + Node)
# ----------------------------------------
FROM php:8.2-cli AS build

WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl unzip git gnupg libzip-dev libonig-dev libxml2-dev zip \
    libpng-dev libsqlite3-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite zip mbstring bcmath

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Allow Composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER=1

# Copy project files
COPY . .

# Install PHP dependencies without scripts (avoid root error)
RUN composer install --optimize-autoloader --no-dev --no-scripts

# Manually run Laravel package discovery
RUN php artisan package:discover

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# ----------------------------------------
# Stage 2: Runtime (Apache + PHP)
# ----------------------------------------
FROM php:8.2-apache

WORKDIR /var/www/html

# Install Apache extensions
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git libpng-dev libonig-dev libxml2-dev libsqlite3-dev zip && \
    docker-php-ext-install pdo pdo_mysql pdo_sqlite zip mbstring bcmath

# Enable Apache rewrite module
RUN a2enmod rewrite

# Set Laravel public folder as Apache root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# Copy built project from stage 1
COPY --from=build /var/www /var/www/html

# Prepare SQLite database
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data storage bootstrap/cache database

# Run Laravel migrations & seeders, then start Apache
CMD bash -c "php artisan migrate --force && php artisan db:seed --force && exec apache2-foreground"
