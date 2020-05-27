var $submitBtn = $("#submit");
var $drinkList = $("#drink-list");
// The API object contains methods for each kind of request we'll make
var API = {
  saveDrink: function(newDrink) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/newDrink",
      data: JSON.stringify(newDrink)
    });
  },
  getDrinks: function() {
    return $.ajax({
      url: "api/drinks",
      type: "GET"
    });
  },
  getOneDrink: function(name) {
    return $.ajax({
      url: "api/drinks/:" + name,
      type: "GET"
    });
  },
  deleteDrink: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};
$("#search").on("click", function(event) {
  event.preventDefault();
  console.log("the click worked");
  // Save the drink they typed into the drink-search input
  var drinkSearched = $("#searchText")
    .val()
    .trim();
  // Make an AJAX get request to our api, including the user's drink in the url
  API.getOneDrink(drinkSearched).then(function(data) {
    renderDrinks(data);
  });
  // Call our renderBooks function to add our books to the page
});

function renderDrinks(data) {
  for (var i = 0; i < data.length; i++) {
    var div = $("<div>");
    div.append("<h2>" + data[i].Name + "</h2>");
    div.append("<p>Category: " + data[i].Category + "</p>");
    div.append("<p>Alcoholic: " + data[i].Alcoholic + "</p>");
    div.append("<p>Instructions: " + data[i].Instructions + "</p>");
    div.append("<p>Ingredients: " + data[i].Ingredients + "</p>");
    div.append("<p>Measurements: " + data[i].Measurements + "</p>");
    div.append("<img src='" + data[i].Images + "'>");
    div.append(
      "<button class='delete' data-id='" +
        data[i].id +
        "'>DELETE DRINK</button>"
    );
    $("#stats").append(div);
  }
  $(".delete").click(function() {
    $.ajax({
      method: "DELETE",
      url: "/api/book/" + $(this).attr("data-id")
    })
      // On success, run the following code
      .then(function() {
        console.log("Deleted Successfully!");
      });
    $(this)
      .closest("div")
      .remove();
  });
}

// refreshExamples gets new examples from the db and repopulates the list
var refresh = function() {
  API.getDrinks().then(function(data) {
    var $drinks = data.map(function(example) {
      var $a = $("<a>")
        .text(drink.text)
        .attr("href", "/drink/" + drink.name);
      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": drink.id
        })
        .append($a);
      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");
      $li.append($button);
      return $li;
    });
    $exampleList.empty();
    $exampleList.append($drinks);
  });
};
// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list

var handleFormSubmit = function(event) {
  event.preventDefault();
  var search = {
    name: $name.val().trim(),
    ingredient: $ingredient.val().trim()
  };
  if (!search.name) {
    alert("You must enter an example text and description!");
    return;
  }
  API.saveDrink(example).then(function() {
    refresh();
  });
  $name.val("");
  $ingredient.val("");
};
// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");
  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};
// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
