# Procédure de Déploiement sur VPS Hostinger

## 1. Préparation du serveur
apt update && apt upgrade -y
apt install -y git curl wget ufw nginx postgresql postgresql-contrib python3 python3-pip python3-venv nodejs npm certbot python3-certbot-nginx
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

## 2. Base de données
useradd -m -s /bin/bash arkiva
sudo -u postgres psql -c "CREATE USER arkiva WITH PASSWORD 'MOT_DE_PASSE_ULTRA_COMPLEXE_ICI';"
sudo -u postgres psql -c "CREATE DATABASE arkiva OWNER arkiva;"
sudo -u postgres psql -d arkiva -c "CREATE EXTENSION IF NOT EXISTS vector;"

## 3. Code et Environnement
git clone https://github.com/Sekou2206/arkiva.git /var/www/arkiva
chown -R arkiva:arkiva /var/www/arkiva
mkdir -p /var/lib/arkiva/uploads
chown -R arkiva:arkiva /var/lib/arkiva/uploads
chmod 750 /var/lib/arkiva/uploads
nano /var/www/arkiva/.env
chmod 600 /var/www/arkiva/.env
chown arkiva:arkiva /var/www/arkiva/.env

## 4. Installation Backend & Frontend
sudo -u arkiva bash -c "cd /var/www/arkiva/backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
sudo -u postgres psql -d arkiva -f /var/www/arkiva/database/schema.sql
sudo -u arkiva bash -c "cd /var/www/arkiva/frontend && npm install && npm run build"

## 5. Systemd et Nginx
cp /var/www/arkiva/deploy/arkiva-backend.service /etc/systemd/system/
cp /var/www/arkiva/deploy/arkiva-frontend.service /etc/systemd/system/
sed -i 's/DOMAIN_A_CONFIGURER/TON_VRAI_DOMAINE/g' /etc/systemd/system/arkiva-frontend.service
cp /var/www/arkiva/deploy/nginx.conf /etc/nginx/sites-available/arkiva
sed -i 's/DOMAIN_A_CONFIGURER/TON_VRAI_DOMAINE/g' /etc/nginx/sites-available/arkiva
ln -s /etc/nginx/sites-available/arkiva /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
systemctl daemon-reload
systemctl enable arkiva-backend arkiva-frontend nginx
systemctl restart arkiva-backend arkiva-frontend nginx

## 6. DNS et HTTPS
certbot --nginx -d TON_VRAI_DOMAINE -d www.TON_VRAI_DOMAINE
