//jshint esversion:6

const express = require('express');
const app = express();
const bp = require('body-parser');
const ejs = require('ejs');
const fs = require('fs');
const http = require('http');
const https = require('https');

var galleryTitles = [];
app.use(bp.urlencoded({
  extended: true
}));

const privateKey = fs.readFileSync('ssl/letsencrypt/live/www.zeroto6ixty.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('ssl/letsencrypt/live/www.zeroto6ixty.com/cert.pem', 'utf8');
const ca = fs.readFileSync('ssl/letsencrypt/live/www.zeroto6ixty.com/chain.pem', 'utf8');


const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.PORT || 3000, () => {
	console.log('HTTP Server running on port 3000');
});

httpsServer.listen(process.env.PORT || 443, () => {
	console.log('HTTPS Server running on port 443');
});
app.use('/assets/', express.static("./assets/"));
app.use('/css/', express.static("./css/"));

var obj;
fs.readFile('json/ALBUMS.json', 'utf8', function(err, data) {
  if (err) throw err;
  var obj = JSON.parse(data);
  for (var x in obj.album) {
    galleryTitles.push(x);
    console.log("Adding: " + x);
  }
});
app.set('view engine', 'ejs');
app.use(bp.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render("welcome");
  console.log("redirected to /index.ejs");
});

app.post("/gallery", function(req, res) {
  res.render("gallery", {
    newListItems: galleryTitles,
  });
  console.log("redirected to /gallery.ejs");
});
