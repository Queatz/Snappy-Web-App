# Snappy-Web-App
Web interface for Snappy


# Let's Encrypt

/usr/local/sbin/certbot-auto certonly

Choose 2
Enter village.city

sudo openssl rsa -inform pem -in /etc/letsencrypt/live/village.city/privkey.pem -outform pem | less
sudo less /etc/letsencrypt/live/village.city/fullchain.pem
