#!/usr/bin/env bash

apt-get update
apt-get install -y git openssl
openssl dhparam -out /etc/ssl/certs/dhparams.pem 2048
git clone https://github.com/certbot/certbot /opt/certbot
/opt/certbot/certbot-auto certonly --webroot --non-interactive --agree-tos --email bishehsary@gmail.com --force-renew\
    -w /vesta/app/ArmanTelecom-armanWebSite/app/html \
    -d vps299878.ovh.net