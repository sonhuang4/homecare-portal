# ---------- Build Node assets ----------
FROM node:20 AS node-builder
WORKDIR /app

# Copy only what’s needed for front-end build
COPY package.json vite.config.js ./
COPY resources ./resources
COPY public ./public

RUN npm install && npm run build

# ---------- PHP + Apache + Laravel ----------
FROM php:8.2-apache

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libpng-dev libzip-dev libsqlite3-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring zip bcmath

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy Laravel app
COPY . .

# Copy built frontend assets
COPY --from=node-builder /app/public ./public

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    php composer.phar install --no-dev --optimize-autoloader

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Add DirectoryIndex fallback
RUN echo '<IfModule dir_module>\n  DirectoryIndex index.php index.html\n</IfModule>' > /etc/apache2/conf-available/laravel.conf && \
    a2enconf laravel

# Set Laravel public folder as Apache DocumentRoot
RUN printf '%s\n' \
  '<VirtualHost *:80>' \
  '  DocumentRoot /var/www/html/public' \
  '  <Directory /var/www/html/public>' \
  '    Options Indexes FollowSymLinks' \
  '    AllowOverride All' \
  '    Require all granted' \
  '  </Directory>' \
  '</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Expose HTTP port
EXPOSE 80
