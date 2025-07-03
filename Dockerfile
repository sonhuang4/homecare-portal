# Stage 1: Build assets & install dependencies
FROM composer:latest AS build

WORKDIR /var/www

# Copy everything into container
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Install Node & build assets
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# Stage 2: Serve with Apache + PHP
FROM php:8.2-apache

# Required extensions
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo_mysql zip

# Enable Apache rewrite module
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy app from build stage
COPY --from=build /var/www /var/www/html

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Set Laravel public folder
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Update Apache config to use public/ as root
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

EXPOSE 80

CMD ["apache2-foreground"]
