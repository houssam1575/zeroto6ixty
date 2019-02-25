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
//This reads ALBUMS.json, if you want to add more pictures/albums, use ALBUMS.json to add

fs.readFile('json/ALBUMS.json', 'utf8', function(err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
  for (var x in obj.album) {
    galleryTitles.push(x);
    console.log("Adding: " + x);
  }
});

//This sets the view engine as EJS
app.set('view engine', 'ejs');
app.use(bp.urlencoded({
  extended: true
}));
//SERVER CONFIGURATION
app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
//These are the directories to deliver static files
app.use('/assets/', express.static("./assets/"));
app.use('/css/', express.static("./css/"));


//Express redirection
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

//Page iteration of images
app.get('/:user/:token', function(req, res) {
  albumName = req.params.token;
  console.log("User is requesting: " + albumName);
  console.log("Finding token...");
  for (var i = 0; i < galleryTitles.length; i++) {
    if (galleryTitles[i] === albumName) {
      console.log("found token: " + albumName);
      console.log("Album data: " + obj.album[albumName]);
      populateAlbumFile(albumName);
      res.redirect("/album");
      break;
    } else {

    }
  }

  function populateAlbumFile(token) {
    var count = 0;
    if (obj.album[token] === undefined || obj.album[token].length === 0) {
      console.log("data is undefined, album won't load");
    } else {
      var imageLinks = [];
      var albumLinks = [];
      console.log(imageLinks);
      console.log("Populating album for: " + token);
      //This pushes the names of the albums, etc japan
      for (var x in obj.album[token]) {
        imageLinks.push(x);
      }
      var iterateAmount = 0;
      //this pushes the links that are stored into the album
      for(var i = 0; i < obj.album[token][token + "0"].length -1; i++) {
        albumLinks.push(obj.album[token][token + iterateAmount]);
        iterateAmount++;
        console.log(iterateAmount);
      }
        console.log(albumLinks);
        newImageArray = imageLinks;
        newAlbumLinks = albumLinks;
        console.log("Population completed");
        app.get('/album', function(req, res) {
          res.render("album", {
            albumTitle: albumName,
            imageLinks: newImageArray,
            albumLinks: newAlbumLinks
          });
          console.log("redirected to " + albumName + " album");
          console.log("Array passed into " + albumName + ": " + newImageArray);
          console.log("Array links passed into " + albumName + ": " + newAlbumLinks);
        });
    }
  }
});
