# ----------------------------------------
# Stage 1: PHP + Composer + Vite Build
# ----------------------------------------
FROM php:8.2-cli AS build

WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl unzip git gnupg

# Install Composer manually
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy project source
COPY . .

# ✅ Show PHP info and try Composer install (with full error output)
RUN php -v && php -m && php -i && composer install

# Install Node 18 and build frontend assets
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install && npm run build

# ----------------------------------------
# Stage 2: Apache + PHP Runtime
# ----------------------------------------
FROM php:8.2-apache

# Install required PHP extensions (including SQLite fixes)
RUN apt-get update && apt-get install -y \
    libzip-dev libsqlite3-dev unzip git libpng-dev libonig-dev libxml2-dev zip \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql zip fileinfo mbstring bcmath

# Enable Apache rewrite module
RUN a2enmod rewrite

# Set Laravel public folder as Apache root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# Set working directory
WORKDIR /var/www/html

# Copy compiled build from first stage
COPY --from=build /var/www /var/www/html

# Create SQLite DB and fix permissions
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chown -R www-data:www-data storage bootstrap/cache database

# Start: migrate, seed, then Apache
CMD bash -c "php artisan migrate --force && php artisan db:seed --force && exec apache2-foreground"
