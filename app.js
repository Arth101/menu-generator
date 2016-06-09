var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var kvfs = require("kvfs")("database");
var uuid = require("uuid");
var mustache = require("mustache");
var sass = require("node-sass");
var pdf = require('phantomjs-pdf');
var zipper = require("zip-local");

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

  fs.readFile("styles/css/style.css", function(error, styles) {
    if(error) {
      return console.log("could not read style.css");
    }
    console.log("got data2", viewModel);
    var id = uuid.v4();
    kvfs.set(id, viewModel, function(error) {
      if(error) {
        return console.log("could not save data", error);
      }
      viewModel.css = styles.toString();
      fs.readFile("template.html", function(error, template) {
        if(error) {
          return console.log("could not find template.html", error);
        }
        var outputHtml = mustache.render(template.toString(), viewModel);
        pdf.convert({
          html: outputHtml
        }, function(result){
          result.toBuffer(function(pdfContent) {
            fs.writeFile("outputFiles/" + id + ".pdf", pdfContent, function(error) {
              if(error) {
                return console.log("could not write pdf to output", error);
              };
            });
          });
        });
        fs.writeFile("outputFiles/" + id + ".html", outputHtml, function(error) {
          if(error) {
            console.log("could not write html to output", error);
            return res.status(500).send("could not write html to output");
          };
          zipper.zip("outputFiles/" + id + ".html", function(error, zipped) {

            if(!error) {
                zipped.compress(); // compress before exporting

                // or save the zipped file to disk
                zipped.save("outputFiles/" + id + ".zip", function(error) {
                    if(!error) {
                        console.log("ZIP saved successfully !");
                    }
                    if(error){
                      console.log("ERROR ZIPPING");
                    }
                });
            }
        });
        });
      });
      res.redirect("/view/" + id);
    });
  });
});

app.get("/view/:id", function(req, res) {
  fs.readFile("viewTemplate.html", function(error, buffer) {
    if(error) {
      return console.log("could not find template.html", error);
    }
    res.send(mustache.render(buffer.toString(), {id: req.params.id}));
  });
});

app.get("/view/:id/menu.html", function(req, res) {
  fs.readFile("outputFiles/" + req.params.id + ".html", function(error, buffer){
    res.send(buffer.toString());
  });
});

app.get("/view/:id/menu.zip", function(req, res) {
  fs.readFile("outputFiles/" + req.params.id + ".zip", function(error, buffer){
    res.send(buffer);
  });
});

app.get("/view/:id/menu.pdf", function(req, res) {
  fs.readFile("outputFiles/" + req.params.id + ".pdf", function(error, buffer){
    res.send(buffer);
  });
});

app.listen(5000);
