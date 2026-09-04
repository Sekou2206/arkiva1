#!/bin/bash
echo "=== Vérification pré-déploiement Arkiva ==="

echo "[1] Vérification des dépendances..."
command -v python3 >/dev/null 2>&1 && echo "OK: Python3 installé" || echo "ATTENTION: Python3 manquant"
command -v node >/dev/null 2>&1 && echo "OK: Node.js installé" || echo "ATTENTION: Node.js manquant"
command -v npm >/dev/null 2>&1 && echo "OK: npm installé" || echo "ATTENTION: npm manquant"
command -v psql >/dev/null 2>&1 && echo "OK: PostgreSQL installé" || echo "ATTENTION: PostgreSQL manquant"
command -v git >/dev/null 2>&1 && echo "OK: Git installé" || echo "ATTENTION: Git manquant"
command -v nginx >/dev/null 2>&1 && echo "OK: Nginx installé" || echo "ATTENTION: Nginx manquant"

echo "[2] Vérification du fichier .env..."
if [ -f "/opt/arkiva1/Arkiva_Prod/.env" ]; then
    echo "OK: Fichier .env présent"
else
    echo "ATTENTION: Fichier .env manquant dans /opt/arkiva1/Arkiva_Prod/"
fi

echo "[3] Vérification des services..."
systemctl is-active --quiet arkiva-backend && echo "OK: Backend actif" || echo "ATTENTION: Backend inactif"
systemctl is-active --quiet arkiva-frontend && echo "OK: Frontend actif" || echo "ATTENTION: Frontend inactif"

echo "=== Fin du rapport ==="
