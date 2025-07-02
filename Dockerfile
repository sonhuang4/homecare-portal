# -------------------------------------
# Build stage for Vite (Node)
# -------------------------------------
FROM node:20-alpine as node-builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Run Composer to install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

COPY resources/ resources/
COPY vite.config.js ./

RUN npm run build

# -------------------------------------
# Laravel App (PHP + Apache)
# -------------------------------------
FROM php:8.2-apache

WORKDIR /var/www/html

# Enable Apache rewrite
RUN a2enmod rewrite

# Install system deps
RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    && docker-php-ext-install zip pdo pdo_mysql

# Copy Laravel app files
COPY . .

# Set proper permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Add fallback for Apache
RUN echo '<IfModule dir_module>\n  DirectoryIndex index.php index.html\n</IfModule>' > /etc/apache2/conf-available/laravel.conf && \
    a2enconf laravel

# Set public folder as DocumentRoot
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Copy Vite build assets from node-builder
COPY --from=node-builder /app/public/build ./public/build

# Expose port
EXPOSE 80
