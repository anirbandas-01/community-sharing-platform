FROM php:8.2-fpm

WORKDIR /app

# Install system dependencies + nginx
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libpq-dev \
    libonig-dev \
    libzip-dev \
    postgresql-client \
    nginx \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql zip mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chmod -R 775 storage bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache || true

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/sites-available/default
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

EXPOSE 10000

CMD php artisan config:clear && \
    php artisan cache:clear && \
    php artisan route:clear && \
    php artisan view:clear && \
    php artisan migrate --force && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php-fpm -D && \
    sleep 3 && \
    nginx -g "daemon off;"