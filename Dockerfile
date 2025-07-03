# ----------------------------
# Stage 1: Composer + Node Build
# ----------------------------
FROM php:8.2-cli AS build

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    curl unzip git gnupg libzip-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .

# Avoid permission + script issues during build
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --optimize-autoloader --no-scripts

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && npm install && npm run build

# ----------------------------
# Stage 2: Apache Runtime
# ----------------------------
FROM php:8.2-apache

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    libzip-dev libsqlite3-dev unzip git libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite zip fileinfo bcmath mbstring

RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

COPY --from=build /var/www /var/www/html

RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data storage bootstrap/cache database

CMD php artisan config:cache && php artisan migrate --force && php artisan db:seed --force && apache2-foreground
