# Weather Dashboard

## Description
Weather Dashboard is an app that let's User to see the weather outlook for multiple cities so that I can plan a trip accordingly.

Link to the deployed application:: https://ozerkerr.github.io/weather-dashboard/

## Home page
--------------- 

* The User is presented with home page when they open the Weather Dashboard
* Home page contains an input field and search button
* When User enters a city and clicks on search then OpenWeatherApi gets called and four action gets executed: 
  - First a card gets rendered to the right side of page with city name, date and weather condition in body of card.
  - UV index gets rendered with colored container. Color depends on UV index condition.
  - And 5-day forecast section gets rendered for that city with weather conditions for next 5 days.
  - And a city entered gets saved to local storage and history of search table gets displayed to the User.

![Screendshot](./assets/images/Screen%20Shot%202022-07-27%20at%206.16.45%20PM.png "Screendshot")
![Screendshot](./assets/images/Screen%20Shot%202022-07-27%20at%206.16.53%20PM.png "Screendshot")
![Screendshot](./assets/images/Screen%20Shot%202022-07-27%20at%206.18.37%20PM.png "Screendshot")
![Screendshot](./assets/images/Screen%20Shot%202022-07-27%20at%206.17.25%20PM.png "Screendshot")

