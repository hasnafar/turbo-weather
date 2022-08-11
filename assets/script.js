var cityNameEl = document.getElementById("city-name");
var picture = document.getElementById("pic");
var tempNow = document.getElementById("temp");
var humidityNow= document.getElementById("humidity");
var windNow = document.getElementById("wind");
var UVIndexNow = document.getElementById("UV-index");
var cityInput = document.getElementById("enter-city");
var searchButton = document.getElementById("search-button");
var clearAll = document.getElementById("clear-history");
var todayWeather = document.getElementById("weather-today");
var fivedayFuture = document.getElementById("fiveday-bar");
var historySearch = document.getElementById("history");
let searchesEl = JSON.parse(localStorage.getItem("search")) || [];

const APIKey = "1034dcf33dca82f53328575475f0772d";

function displayWeather(cityName) {
    let openWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(openWeatherURL)
            .then(function (response) {

                todayWeather.classList.remove("d-none");

                var currentDate = new Date(response.data.dt * 1000);
                var currentDay = currentDate.getDate();
                var currentMonth = currentDate.getMonth() + 1;
                var currentYear = currentDate.getFullYear();
                cityNameEl.innerHTML = response.data.name + " (" + currentMonth + "/" + currentDay + "/" + currentYear + ") ";
                
                let weatherPic = response.data.weather[0].icon;
                picture.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                picture.setAttribute("alt", response.data.weather[0].description);
                
                tempNow.innerHTML = "Temperature: " + random(response.data.main.temp) + " &#176F";
                humidityNow.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                windNow.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
                
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                
