window.onload = function() {
  console.log("test");
  var viewModel = parseQuery(location.search);
  buildMenu(viewModel, document.body);
  // replaceText(viewModel.name);
  // replaceText(viewModel.description);
  // replaceText(viewModel.price);
  console.log(viewModel);
  console.log(JSON.stringify(viewModel));
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

function replaceText(variable, type){
  var div = document.querySelector(".menu-item");
  var node = document.createTextNode(variable);
  div.appendChild(node);
}

function buildMenu(viewModel, container){
  document.querySelector(".menu-brand").innerHTML = viewModel.storename;
  if(viewModel.storenameAlign == "center"){
    console.log("plz work");
    document.querySelector(".menu-brand").className += " " + "center";
  }
  document.querySelector(".menu-item").innerHTML = viewModel.name;
  document.querySelector(".menu-description").innerHTML = viewModel.description;
  if(viewModel.price == ""){
    document.querySelector(".menu-price").innerHTML = "gratis";
  }else{
    document.querySelector(".menu-price").innerHTML = viewModel.price + " kr.";
  }

}
