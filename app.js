var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var kvfs = require("kvfs")("database");
var uuid = require("uuid");
var mustache = require("mustache");
var sass = require("node-sass");
var pdf = require('phantomjs-pdf');
var zipper = require("zip-local");

// render scss to css
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

// run server
var app = express();
app.listen(5000);

// allow access to required folders
app.use(bodyParser.urlencoded());
app.use("/styles", express.static("styles"));
app.use("/js", express.static("js"));

// set index
app.get("/", function(req, res) {
  fs.readFile("views/menu-gen.html", function(error, buffer) {
    if(error) {
      return console.log("could not read menu-gen", error);
    }
    res.send(buffer.toString());
  });
});

// POST request from menu-gen.html
app.post("/save", function(req, res) {
  console.log("got data", req.body);
  var viewModel = req.body.viewModel;
  viewModel = JSON.parse(viewModel);

  fs.readFile("styles/css/style.css", function(error, styles) {
    if(error) {
      return console.log("could not read style.css");
    }
    console.log("Read Data from style.css");
    var id = uuid.v4();
    kvfs.set(id, viewModel, function(error) {
      console.log("ID is: ",id);
      if(error) {
        return console.log("could not save data", error);
      }
      viewModel.css = styles.toString();
      fs.readFile("views/template.html", function(error, template) {
        if(error) {
          return console.log("could not find template.html", error);
        }
        var outputHtml = mustache.render(template.toString(), viewModel);
        convertPdf(outputHtml, id);
        saveHtml(outputHtml, id);
        zipFile(id);
        saveJson(viewModel, id);
      });
      res.redirect("/view/" + id);
    });
  });
});

// additional routes
app.get("/view/:id", function(req, res) {
  fs.readFile("views/downloadsView.html", function(error, buffer) {
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

// save menu formats functions
function convertPdf(outputHtml, id){
  pdf.convert({
    html: outputHtml
  }, function(result){
    result.toBuffer(function(pdfContent) {
      fs.writeFile("outputFiles/" + id + ".pdf", pdfContent, function(error) {
        if(error) {
          return console.log("could not write pdf to output", error);
        };
        console.log("PDF saved successfully!");
      });
    });
  });
}

function saveHtml(outputHtml, id){
  fs.writeFile("outputFiles/" + id + ".html", outputHtml, function(error) {
    if(error) {
      console.log("could not write html to output", error);
      return res.status(500).send("could not write html to output");
    };
    console.log("HTML saved successfully!");
  });
}

function zipFile(id){
  zipper.zip("outputFiles/" + id + ".html", function(error, zipped) {
    if(!error) {
        zipped.compress();
        zipped.save("outputFiles/" + id + ".zip", function(error) {
            if(!error) {
                console.log("ZIP saved successfully!");
            };
            if(error){
              console.log("ERROR ZIPPING");
            };
        });
    };
  });
};

function saveJson(viewModel, id){
  viewModel = JSON.stringify(viewModel, null, 2);
  fs.writeFile("outputFiles/" + id + ".json", viewModel, function(error) {
    if(error) {
      console.log("could not write JSON to output", error);
      return res.status(500).send("could not write html to output");
    };
    console.log("JSON saved successfully!");
    zipper.zip("outputFiles/" + id + ".json", function(error, zipped) {
      if(!error) {
          zipped.compress();
          zipped.save("outputFiles/json-" + id + ".zip", function(error) {
              if(!error) {
                  console.log("JSON-ZIP saved successfully!");
              };
              if(error){
                console.log("ERROR ZIPPING JSON");
              };
          });
      };
    });
  });

};
