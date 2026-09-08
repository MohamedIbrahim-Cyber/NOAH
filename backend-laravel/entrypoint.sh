#!/bin/bash
set -e

# Ensure all cache and storage directories exist
mkdir -p bootstrap/cache \
         storage/app/public \
         storage/framework/cache/data \
         storage/framework/sessions \
         storage/framework/views \
         storage/logs

# Set writable permissions for the web server / container runtime
chmod -R 777 bootstrap/cache storage 2>/dev/null || chmod -R 775 bootstrap/cache storage

# Run migrations/cache clear if artisan is present and database is configured
if [ -f artisan ]; then
    php artisan config:clear || true
    php artisan cache:clear || true
fi

# Execute command or default to artisan serve
if [ $# -gt 0 ]; then
    exec "$@"
else
    exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
fi
