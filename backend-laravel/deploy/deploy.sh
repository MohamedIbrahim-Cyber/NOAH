#!/bin/bash
# ==============================================================================
# Nohe Academy - Deployment Script for Hostinger VPS
# ==============================================================================

set -e

APP_DIR="/var/www/nohe-api"

cd "$APP_DIR"

echo ">>> Putting application in maintenance mode..."
php artisan down --render="errors::503" || true

echo ">>> Pulling latest code..."
git pull origin main

echo ">>> Installing composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo ">>> Running database migrations..."
php artisan migrate --force

echo ">>> Caching configuration, routes, and views..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo ">>> Restarting queue workers..."
php artisan queue:restart
sudo supervisorctl restart nohe-worker:*

echo ">>> Bringing application out of maintenance mode..."
php artisan up

echo ">>> Deployment successfully completed!"
