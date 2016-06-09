document.querySelector("#newInput").addEventListener("focus", createNewNodes);

  function createNewNodes(){
    console.log("pllz");
    document.querySelector("#newInput").removeEventListener("focus", createNewNodes);
    var inputs = document.querySelector(".new");
    if(inputs == null){
      var cln = '<div class="menu-item row new js-fade fade-in">\<div class="container-name"><input class="item-name" id="newInput" type="text" placeholder="Item name" name="horse11"><input class="item-description" type="text" placeholder="Item description" name="horse12"></div><div class="container-price"><input class="item-price" type="number" min="0" step="0.01" placeholder="item price" name="horse13"></div><span class="delete" onclick="deleteItem(this)">✖</span></div>'
    }
    else {
      var cln = inputs.cloneNode(true);
    }
    console.log(cln);
    var clonedInputs = document.getElementsByTagName('input');
    console.log(e);

    document.querySelector(".new").className = document.querySelector(".new").className.replace( /(?:^|\s)new(?!\S)/g , '' );
    document.querySelector(".menu-items").appendChild(cln);
    document.querySelector("#newInput").removeAttribute("id");
    document.querySelector("#newInput").addEventListener("focus", createNewNodes);



    var elements = document.querySelectorAll(".new input");
    console.log("long:", elements.length);
    for (var i = 0, element; element = elements[i++];) {
      var e = document.querySelectorAll("input").length + i;
      element.setAttribute("name", "horse" + e);
      console.log("it's an empty textfield");
    }
  }

  document.querySelector(".submit-btn").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("prevented!");
    var viewModel = {};
    var menuItems  = [];

    var menuBrand = document.querySelector(".menu-brand").value;
    viewModel["storename"] = menuBrand;
    var menuAlign = document.querySelector('input[name="storenameAlign"]:checked').value;
    viewModel["storenameAlign"] = menuAlign;

    var inputs = document.querySelectorAll(".menu-item");
    Array.prototype.forEach.call(inputs, function(input) {
      var obj = {};
      var itemName = input.querySelector(".item-name").value;
      if(itemName == ""){
        return;
      };
      var itemDescription = input.querySelector(".item-description").value;
      var itemPrice = input.querySelector(".item-price").value;
      if(itemPrice == ""){
        itemPrice = "0";
      };
      obj["name"] = itemName;
      obj["description"] = itemDescription;
      obj["price"] = itemPrice;
      menuItems.push(obj);
      console.log("works");
    });
    if(menuItems.length == 0){
      var alert = '<div class="alert js-fade fade-in">Please fill in something</div>';
      document.querySelector(".alertContainer").innerHTML += alert;
      return true;
    };
    viewModel["menuItems"] = menuItems;
    console.log(JSON.stringify(viewModel));
    document.querySelector("#hidden").value = JSON.stringify(viewModel);
    document.querySelector("#hiddenform").submit();
    return false;
});

function deleteItem(e){
    var parent = e.parentNode;
    console.log(parent);
    parent.remove();
  }

  function addItem(){
    var cln = '<div class="menu-item row new js-fade fade-in">\<div class="container-name"><input class="item-name" id="newInput" type="text" placeholder="Item name" name="horse11"><input class="item-description" type="text" placeholder="Item description" name="horse12"></div><div class="container-price"><input class="item-price" type="number" min="0" step="0.01" placeholder="item price" name="horse13"></div><span class="delete" onclick="deleteItem(this)">✖</span></div>';
    document.querySelector(".menu-items").insertAdjacentHTML( 'beforeend', cln );
  }
