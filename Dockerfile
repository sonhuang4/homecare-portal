FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip sqlite3 libsqlite3-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy files
COPY . .

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader

# Build JS
RUN npm install && npm run build

# Set permissions
RUN chmod -R 755 storage bootstrap/cache

EXPOSE 10000

CMD ["bash", "./start.sh"]
