var crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var https = require('https');
var path = require('path');

var app = express();

var privateKey = fs.readFileSync('/etc/letsencrypt/archive/vlllage.com/privkey2.pem').toString();
var certificate = fs.readFileSync('/etc/letsencrypt/archive/vlllage.com/fullchain2.pem').toString();
var credentials = crypto.createCredentials({key: privateKey, cert: certificate});

app.get('**', function(req, res, next) {
    var file = path.join(__dirname, req.url);

    try {
        fs.accessSync(file, fs.R_OK);
    } catch(e) {
        file = path.join(__dirname, 'index.html');
    }

    res.status(200).sendFile(file);
});

var server = https.createServer(credentials, app);

server.listen(3000)