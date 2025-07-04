# ✅ Base image
FROM php:8.2-fpm

# ✅ Set working directory
WORKDIR /var/www/html

# ✅ Install system dependencies
RUN apt-get update && apt-get install -y \
    zip unzip git curl libonig-dev libxml2-dev sqlite3 libsqlite3-dev \
    gnupg ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    docker-php-ext-install pdo pdo_sqlite

# ✅ Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ✅ Copy project files
COPY . .

# ✅ Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# ✅ Install Node dependencies and build assets
RUN npm install && npm run build

# ✅ Set permissions
RUN chmod -R 775 storage bootstrap/cache

# ✅ Start Laravel server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
