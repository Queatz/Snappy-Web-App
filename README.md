# Snappy-Web-App
Web interface for Snappy


#### Build

    ng build -prod -op dist/ --aot

# Let's Encrypt

sudo certbot certonly

Choose 2
Enter village.city

sudo less /etc/letsencrypt/live/village.city/fullchain.pem
sudo openssl rsa -inform pem -in /etc/letsencrypt/live/village.city/privkey.pem -outform pem | less

Upload to Google Console (App Engine)





sudo certbot certonly --webroot -w web-app/src/main/webapp -d village.city

