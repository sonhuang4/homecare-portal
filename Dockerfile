# Step 1: Build Vite assets
FROM node:20 AS node-builder
WORKDIR /app

COPY package.json vite.config.js ./          
COPY resources ./resources
COPY public ./public

RUN npm install && npm run build

# Step 2: Set up PHP + Apache + Composer
FROM php:8.2-apache

# Install PHP extensions and dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libpng-dev libzip-dev libsqlite3-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring zip bcmath

# Enable Apache modules
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy Laravel app code
COPY . .

# Copy built frontend assets into public folder
COPY --from=node-builder /app/public ./public

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    php composer.phar install --no-dev --optimize-autoloader

# Set Laravel permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Add DirectoryIndex fallback for Laravel
RUN echo '<IfModule dir_module>\n  DirectoryIndex index.php index.html\n</IfModule>' > /etc/apache2/conf-available/laravel.conf && \
    a2enconf laravel

# Set Laravel public folder as Apache DocumentRoot
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Expose port 80
EXPOSE 80
