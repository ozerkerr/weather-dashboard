const searchDiv = $('#search-table');
const mainContet = $('#main-content');

// function to render search bar
function createSearchBar() {
  // create elements
  const inputGroup = $('<div>');
  const searchBar = $('<input>');
  const searchButton = $('<button>');

  searchBar.attr("type", "search");
  searchBar.attr("class", "form-control rounded d-flex flex-row");
  searchBar.attr("placeholder", "City name");
  searchBar.attr("aria-label", "Search");
  searchBar.attr("aria-describedby", "search-addon");
  searchBar.attr("id", "search-bar");

  // set attributes for button
  searchButton.attr("type", "button");
  searchButton.attr("class", "btn btn-outline-primary mt-2 mb-2 w-100");
  searchButton.text("Search");

  searchButton.click(function () {
    searchCity($('#search-bar').val());
    $('#search-bar').val('');
  })

  // append children to html
  inputGroup.append(searchBar, searchButton);
  searchDiv.append(inputGroup);
}

function searchCity(city) {
  const storedCities = JSON.parse(localStorage.getItem("cities")) || [];

  storedCities.push(city);

  localStorage.setItem("cities", JSON.stringify(storedCities));
}

function renderSearchedCitiesList() {
  const listGroup = $('<ul>');
  const storedCities = JSON.parse(localStorage.getItem("cities")) || [];

  listGroup.attr("class", "list-group list-group-light");

  storedCities.map((city) => {
    const listItem = $('<li>');

    listItem.text(city);

    listGroup.append(listItem);
  })

  searchDiv.append(listGroup);
}

// create function for divier in search column
function searchBarDivider() {
  // create elements
  const divider = $('<hr>');
  
  // set attributest
  divider.attr("class", "my-3");

  // append child
  searchDiv.append(divider);
}

// function to initialize js
function init() {
  createSearchBar();
  searchBarDivider();
  renderSearchedCitiesList();
  console.log('qqq');
}

// calling initializer 
init();