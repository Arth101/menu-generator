window.onload = function() {
  var viewModel = JSON.parse(parseQuery(location.search).viewModel);
  buildMenu(viewModel, document.body);
  console.log("viewModel:storename = ",viewModel.storename);
  console.log(JSON.stringify(viewModel));
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
  };

  viewModel.menuItems.forEach(function(item){
    if(item.price == ""){
      var price = "Free";
    } else {
      var price = item.price + " kr";
    }
    console.log("menuITems!",item.itemName);
    var htmlMenuItem = '<div class="menu-items generated">\
                          <div class="menu-item row">\
                            <div>\
                              <p class="item-name">' + item.name + '</p>\
                              <p class="item-description">' + item.description + '</p>\
                            </div>\
                            <div>\
                              <p class="item-price">' + price + '</p>\
                            </div>\
                          </div>\
                        </div>';
    var results = document.querySelector('.row');
    results.innerHTML += htmlMenuItem;
  });

  // document.querySelector(".menu-item").innerHTML = viewModel.name;
  // document.querySelector(".menu-description").innerHTML = viewModel.description;
  // if(viewModel.price == ""){
  //   document.querySelector(".menu-price").innerHTML = "gratis";
  // }else{
  //   document.querySelector(".menu-price").innerHTML = viewModel.price + " kr.";
  // };

}
