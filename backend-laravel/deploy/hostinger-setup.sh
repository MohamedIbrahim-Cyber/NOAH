#!/bin/bash
# ==============================================================================
# Nohe Academy - Hostinger VPS Automated Provisioning Script
# OS: Ubuntu 24.04 LTS / 22.04 LTS (Hostinger KVM Top Plan)
# Stack: PHP 8.3, MySQL 8.0, Nginx, Composer, Supervisor, Redis, Certbot, UFW
# ==============================================================================

set -e

echo ">>> [1/8] Updating System Packages..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl wget git unzip software-properties-common ufw supervisor

echo ">>> [2/8] Adding Ondrej PHP PPA & Installing PHP 8.3 + Extensions..."
sudo add-apt-repository -y ppa:ondrej/php
sudo apt-get update
sudo apt-get install -y php8.3 php8.3-fpm php8.3-mysql php8.3-mbstring \
    php8.3-xml php8.3-bcmath php8.3-curl php8.3-zip php8.3-intl php8.3-redis

echo ">>> [3/8] Installing Composer..."
curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php
sudo php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer

echo ">>> [4/8] Installing & Hardening MySQL..."
sudo apt-get install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql

# Create Database and Dedicated User
DB_NAME="nohe_academy_db"
DB_USER="nohe_user"
DB_PASS="SecureNohePassword2026!#"

sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'127.0.0.1';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo ">>> [5/8] Installing Nginx..."
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

echo ">>> [6/8] Configuring Firewall (UFW)..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo ">>> [7/8] Installing Certbot for SSL (Let's Encrypt)..."
sudo apt-get install -y certbot python3-certbot-nginx

echo ">>> [8/8] Provisioning Complete!"
echo "Next Steps:"
echo "1. Clone or copy 'backend-laravel' into /var/www/nohe-api"
echo "2. Copy deploy/nginx-nohe.conf to /etc/nginx/sites-available/nohe-api and symlink to sites-enabled"
echo "3. Run 'composer install --no-dev --optimize-autoloader'"
echo "4. Copy .env.example to .env, set APP_KEY via 'php artisan key:generate', and run 'php artisan migrate --seed'"
echo "5. Copy deploy/supervisord-queue.conf to /etc/supervisor/conf.d/ and restart supervisor"
echo "6. Run 'sudo certbot --nginx -d api.noheacademy.sa' to activate free SSL"
