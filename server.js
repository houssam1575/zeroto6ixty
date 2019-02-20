const express = require('express');
const app = express();
const bp = require('body-parser');
const ejs = require('ejs');


app.set('view engine', 'ejs');

app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
app.use('/assets/', express.static("./assets/"));

app.get("/", function(req, res) {
  res.render("index");
  console.log("redirected to /index.ejs");
});
