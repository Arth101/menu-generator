var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var kvfs = require("kvfs")("database");
var uuid = require("uuid");
var mustache = require("mustache");
var sass = require("node-sass");

sass.render({
  file: "styles/scss/style.scss"
}, function(error, result) {
  if(error){
    return console.log("error loading sass", error);
  }
  fs.writeFile("styles/css/style.css", result.css, function(error, buffer) {
    if(error) {
      return console.log("could not write style", error);
    }
  });
});

var app = express();
app.use(bodyParser.urlencoded());

app.get("/", function(req, res) {
  fs.readFile("menu-gen.html", function(error, buffer) {
    if(error) {
      return console.log("could not read menu-gen", error);
    }
    res.send(buffer.toString());
  });
});

app.use("/styles", express.static("styles"));
app.use("/js", express.static("js"));

app.post("/save", function(req, res) {
  console.log("got data", req.body);
  var viewModel = req.body.viewModel;
  viewModel = JSON.parse(viewModel);
  var id = uuid.v4();
  kvfs.set(id, viewModel, function(error) {
    if(error) {
      return console.log("could not save data", error);
    }
    res.redirect("/view/" + id);
  });
});

app.get("/view/:id", (req, res) => {
  kvfs.get(req.params.id, function(error, viewModel) {
    if(error) {
      return console.log("could not get file", error);
    }
    fs.readFile("template.html", function(error, buffer) {
      if(error) {
        return console.log("could not find template.html", error);
      }
      res.send(mustache.render(buffer.toString(), viewModel));
    })
  });
});

app.listen(5000);
