//jshint esversion:6

const express = require('express');
const app = express();
const bp = require('body-parser');
const ejs = require('ejs');


var galleryTitles = [];
app.use(bp.urlencoded({
  extended: true
}));


var fs = require('fs');
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

app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
app.use('/assets/', express.static("./assets/"));
app.use('/css/', express.static("./css/"));
app.use(express.static(__dirname, { dotfiles: 'allow' } ));
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
