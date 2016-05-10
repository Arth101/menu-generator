window.onload = function() {
  console.log("test");
  first = getQueryVariable("first");
  second = getQueryVariable("second");
  third = getQueryVariable("third");
  var viewModel = parseQuery(location.search);
  replaceText(viewModel.first);
  replaceText(second);
  replaceText(third);
  console.log(viewModel);
};

function getQueryVariable(variable){
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
}

function parseQuery(queryString) {
            var viewModel = {};
            var queries = queryString.substring(1).split("&").forEach(function(part) {
                part = part.replace(/\+/g, " ");
                if(!part.indexOf("=")) return viewModel[decodeURIComponent(part)] = true;
                var splitPart = part.split("=");
                return viewModel[decodeURIComponent(splitPart[0])] = decodeURIComponent(splitPart[1]);
            });
            return viewModel;
        }

function replaceText(variable){
  var para = document.createElement("p");
  var node = document.createTextNode(variable);
  para.appendChild(node);
  var element = document.getElementById("div1");
  element.appendChild(para);
}
