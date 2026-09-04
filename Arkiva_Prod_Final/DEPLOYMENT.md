# Procédure de Déploiement sur VPS Hostinger (Ubuntu)

## 1. Pré-requis
- Accès SSH root au serveur
- Nom de domaine configuré (pointant vers l'IP du VPS)

## 2. Installation des paquets
apt update && apt upgrade -y
apt install -y git curl wget ufw nginx postgresql postgresql-contrib python3 python3-pip python3-venv nodejs npm certbot python3-certbot-nginx

## 3. Création de l'utilisateur arkiva
useradd -m -s /bin/bash arkiva

## 4. PostgreSQL
sudo -u postgres psql -c "CREATE USER arkiva WITH PASSWORD 'VOTRE_MOT_DE_PASSE_COMPLEXE';"
sudo -u postgres psql -c "CREATE DATABASE arkiva OWNER arkiva;"

## 5. Clone du repository
mkdir -p /opt/arkiva1
git clone https://github.com/Sekou2206/arkiva1.git /opt/arkiva1/Arkiva_Prod
chown -R arkiva:arkiva /opt/arkiva1

## 6. Configuration .env
nano /opt/arkiva1/Arkiva_Prod/.env
chmod 600 /opt/arkiva1/Arkiva_Prod/.env
chown arkiva:arkiva /opt/arkiva1/Arkiva_Prod/.env

## 7. Dossier d'uploads
mkdir -p /var/lib/arkiva/uploads
chown -R arkiva:arkiva /var/lib/arkiva/uploads
chmod 750 /var/lib/arkiva/uploads

## 8. Installation backend (Python)
sudo -u arkiva bash -c "cd /opt/arkiva1/Arkiva_Prod/backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"

## 9. Initialisation PostgreSQL
sudo -u postgres psql -d arkiva -f /opt/arkiva1/Arkiva_Prod/database/schema.sql

## 10. Installation frontend
sudo -u arkiva bash -c "cd /opt/arkiva1/Arkiva_Prod/frontend && npm install"

## 11. Build Next.js
sudo -u arkiva bash -c "cd /opt/arkiva1/Arkiva_Prod/frontend && npm run build"

## 12. Installation systemd
cp /opt/arkiva1/Arkiva_Prod/deploy/arkiva-backend.service /etc/systemd/system/
cp /opt/arkiva1/Arkiva_Prod/deploy/arkiva-frontend.service /etc/systemd/system/
sed -i 's/DOMAIN_A_CONFIGURER/VOTRE_DOMAINE.com/g' /etc/systemd/system/arkiva-frontend.service
systemctl daemon-reload
systemctl enable arkiva-backend arkiva-frontend
systemctl start arkiva-backend arkiva-frontend

## 13. Configuration Nginx
cp /opt/arkiva1/Arkiva_Prod/deploy/nginx.conf /etc/nginx/sites-available/arkiva
sed -i 's/DOMAIN_A_CONFIGURER/VOTRE_DOMAINE.com/g' /etc/nginx/sites-available/arkiva
ln -s /etc/nginx/sites-available/arkiva /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

## 14. DNS
Assurez-vous que votre enregistrement A pointe vers l'IP du VPS.

## 15. HTTPS Certbot
certbot --nginx -d VOTRE_DOMAINE.com -d www.VOTRE_DOMAINE.com

## 16. Firewall
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

## 17. Tests
/opt/arkiva1/Arkiva_Prod/scripts/pre-deploy-check.sh

## 18. Logs
journalctl -u arkiva-backend -f
journalctl -u arkiva-frontend -f

## 19. Mise à jour
cd /opt/arkiva1/Arkiva_Prod
git pull
sudo -u arkiva bash -c "cd backend && source venv/bin/activate && pip install -r requirements.txt"
sudo -u arkiva bash -c "cd frontend && npm install && npm run build"
systemctl restart arkiva-backend arkiva-frontend

## 20. Backup
pg_dump -U arkiva -d arkiva -F c -f /var/backups/arkiva_db_$(date +%F).dump
