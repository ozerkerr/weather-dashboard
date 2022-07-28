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

    listItem.click(function() {
      searchCity(listItem.text())
    })

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
  mainContet.empty();
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
          getWeatherApi(data[0].lat, data[0].lon, param)
        })
      }
  });
};

// create function to get weather data based on lat and lon
function getWeatherApi(lat, lon, city) {
  const requestUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`;

  // use fetch to get data
  fetch(requestUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          renderCurrentWeather(data, city);
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
    listItem.click(function() {
      searchCity(city)
    })

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

function renderCurrentWeather(data, city) {
  // create elements
  const cardDiv = $('<div>');
  const cardBody = $('<div>');
  const titleDiv = $('<div>');
  const cardTitle = $('<h4>');
  const temp = $('<p>');
  const wind = $('<p>');
  const humid = $('<p>');
  const uv = $('<p>');
  const iconDiv = $('<div>');
  const icon = $('<img>');
  const uvBadge = $('<a>');

  const uvColor = data.current.uvi <= 3 ? "badge-success"
  : data.current.uvi > 3 && data.current.uvi <= 7 ? "badge-warning" : "badge-danger";

  // set attr
  cardDiv.attr("class", "card border-primary mb-3");
  cardBody.attr("class", "card-body")
  cardTitle.attr("class", "card-title text-primary");
  temp.attr("class", "card-text mt-3");
  wind.attr("class", "card-text mt-3");
  humid.attr("class", "card-text mt-3");
  uv.attr("class", `card-text mt-3`);
  titleDiv.attr("class", "card-header d-flex flex-row align-items-end");

  // create needed vars 
  const myDate = (new Date(eval(data.current.dt*1000))).toLocaleString().split(",")[0];
  const iconCode = data.current.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  const nextFiveDays = data.daily.slice(1, 6)

  // pass data to elements
  cardTitle.text(`${city} (${myDate})`);
  temp.text(`Current temperature: ${data.current.temp}`);
  wind.text(`Wind: ${data.current.wind_speed} mph`);
  humid.text(`Humidity: ${data.current.humidity}%`);
  uv.text(`UV index:`);

  uvBadge.attr("class", `badge ${uvColor}`)
  uvBadge.text(`${data.current.uvi}`)
  uv.append(uvBadge)

  // set attr for icon
  iconDiv.attr("id", "icon");
  icon.attr("id", "wicon");
  icon.attr("src", iconUrl);
  icon.attr("alt", "Weather icon");

  // append to DOM
  iconDiv.append(icon);
  titleDiv.append(cardTitle, iconDiv);
  cardBody.append(temp, wind, humid, uv);
  cardDiv.append(titleDiv, cardBody);
  mainContet.append(cardDiv);

  renderFiveDayForecastSection(nextFiveDays);
}

// function that render next 5 day forecast
function renderFiveDayForecastSection(nextFiveDays) {
  // create elements
  const mainSection = $('<div>');
  const sectionTitle = $('<h4>');
  const strongTag = $('<strong>');
  const sectionContainer = $('<div>');

  // set attr
  sectionContainer.attr("class", "row d-flex flex-row")
  strongTag.text('5-Day Forecast:');

  // append to parent element
  mainSection.append(sectionTitle, sectionContainer);

  // map through passed data to create new cards for each one
  nextFiveDays.map(day => {
    // create elements
    const cardDiv = $('<div>');
    const cardBody = $('<div>');
    const titleDiv = $('<div>');
    const cardTitle = $('<h4>');
    const temp = $('<p>');
    const wind = $('<p>');
    const humid = $('<p>');
    const iconDiv = $('<div>');
    const icon = $('<img>');

    // create vars
    const iconCode = day.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    // set attr
    iconDiv.attr("id", "icon");
    icon.attr("id", "wicon");
    icon.attr("src", iconUrl);
    icon.attr("alt", "Weather icon");
    
    // set attr
    cardDiv.attr("class", "card border-primary mb-3 col-lg-2 ml-3 mr-3 p-0");
    cardBody.attr("class", "card-body")
    cardTitle.attr("class", "card-title text-primary");
    temp.attr("class", "card-text mt-3");
    wind.attr("class", "card-text mt-3");
    humid.attr("class", "card-text mt-3");
    titleDiv.attr("class", "card-header d-flex flex-row align-items-end");

    // get date
    const myDate = (new Date(eval(day.dt*1000))).toLocaleString().split(",")[0];

    // pass data to dom
    cardTitle.text(`(${myDate})`);
    temp.text(`Temp: ${day.temp.day}`);
    wind.text(`Wind: ${day.wind_speed} mph`);
    humid.text(`Humidity: ${day.humidity}%`);

  // append to parent element
    iconDiv.append(icon);
    titleDiv.append(cardTitle);
    cardBody.append(iconDiv, temp, wind, humid);
    cardDiv.append(titleDiv, cardBody);
    sectionContainer.append(cardDiv)
  })

  // append to dom
  sectionTitle.append(strongTag);
  mainContet.append(mainSection);
}

// function to initialize js
function init() {
  createSearchBar();
  searchBarDivider();
  renderSearchedCitiesList();
}

// calling initializer 
init();