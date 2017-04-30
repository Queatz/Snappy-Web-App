var crypto = require('crypto');
var express = require('express');
var fs = require('fs');
var https = require('https');
var path = require('path');

var app = express();

var privateKey = fs.readFileSync('/etc/letsencrypt/live/vlllage.com/privkey.pem').toString();
var certificate = fs.readFileSync('/etc/letsencrypt/live/vlllage.com/fullchain.pem').toString();
var credentials = {key: privateKey, cert: certificate};

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