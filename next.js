window.onload = function() {
  console.log("test");
  first = getQueryVariable("first");
  second = getQueryVariable("second");
  third = getQueryVariable("third");
  console.log(first);
  replaceText(first);
  replaceText(second);
  replaceText(third);
};

function getQueryVariable(variable){
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

function replaceText(variable){
  var para = document.createElement("p");
  var node = document.createTextNode(variable);
  para.appendChild(node);
  var element = document.querySelector("#div1");
  element.appendChild(para);
}
