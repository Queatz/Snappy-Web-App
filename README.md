# Snappy-Web-App
Web interface for Snappy


# Let's Encrypt

sudo certbot certonly

Choose 2
Enter village.city

sudo less /etc/letsencrypt/live/village.city/fullchain.pem
sudo openssl rsa -inform pem -in /etc/letsencrypt/live/village.city/privkey.pem -outform pem | less

Upload to Google Console (App Engine)