# -----------------------------
# Stage 1: Build PHP + Node + Composer
# -----------------------------
FROM php:8.2-cli AS build

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    unzip git curl gnupg libzip-dev libpng-dev libonig-dev libxml2-dev libsqlite3-dev zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .

RUN cp .env.example .env || true
RUN mkdir -p storage bootstrap/cache && chmod -R 775 storage bootstrap/cache

# ✅ Fix: allow root + keep scripts
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# -----------------------------
# Stage 2: Runtime
# -----------------------------
FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libzip-dev libsqlite3-dev zip git unzip \
    libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip fileinfo mbstring bcmath

RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

WORKDIR /var/www/html

COPY --from=build /var/www /var/www/html

RUN chown -R www-data:www-data storage bootstrap/cache database || true

# Optional: run Laravel post-setup
RUN php artisan config:clear && \
    php artisan package:discover --ansi || true

CMD ["apache2-foreground"]
