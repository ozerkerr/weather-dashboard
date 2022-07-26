// grab DOM references
const searchDiv = $('#search-table');
const mainContet = $('#main-content');

// create global vars
const storedCities = JSON.parse(localStorage.getItem("cities")) || [];
const apiKey = "2c81cdc8d272d546f790d65b4c95f8c9";
// function to render search bar
function createSearchBar() {
  // create elements
  const inputGroup = $('<div>');
  const searchBar = $('<input>');
  const searchButton = $('<button>');

  // set attributes
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
    // Call search City function with search value 
    searchCity($('#search-bar').val());
    // create new list item of search history
    const listGroup = $('.list-group')
    const listItem = $('<a>');

    // add class for list item
    listItem.attr("class", "list-group-item list-group-item-action px-3 border-0 rounded-3 mb-2 list-group-item-info d-flex justify-content-center")
    // add text
    listItem.text($('#search-bar').val());
    // append to div element
    listGroup.prepend(listItem)
    $('#search-bar').val('');
  })

  // append children to html
  inputGroup.append(searchBar, searchButton);
  searchDiv.append(inputGroup);
};

// search function which also stores value into local storage
function searchCity(city) {
  storedCities.push(city);

  // save to local storage
  localStorage.setItem("cities", JSON.stringify(storedCities));
  getLocationApi(city)
};

// create function to get lat and long based on city name
function getLocationApi(param) {
  const city = param.replace(' ', '+');
  const requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  fetch(requestUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getWeatherApi(data[0].lat, data[0].lon)
        })
      }
  });
};

// create function to get weather data based on lat and lon
function getWeatherApi(lat, lon) {
  console.log(lat, lon, "robin");
  const requestUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(requestUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data, 'hancock')
        })
      }
    });


};

// render list of search history  
function renderSearchedCitiesList() {
  // create div element and add attribute
  const listGroup = $('<div>');
  listGroup.attr("class", "list-group list-group-light");

  // map through array and reverse and return list items
  storedCities.slice(0).reverse().map((city) => {
    const listItem = $('<a>');

    listItem.attr("class", "list-group-item list-group-item-action px-3 border-0 rounded-3 mb-2 list-group-item-info d-flex justify-content-center")
    listItem.text(city);

    listGroup.append(listItem);
  })

  // append to DOM
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