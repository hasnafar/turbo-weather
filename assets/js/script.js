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
                let UVIndexURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";

                axios.get(UVIndexURL)
                    .then(function (response) {
                        let UVIndex = document.createElement("span");
                        
                        if (response.data[0].value < 4 ) {
                            UVIndex.setAttribute("class", "badge badge-success");
                        }
                        else if (response.data[0].value < 8) {
                            UVIndex.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            UVIndex.setAttribute("class", "badge badge-danger");
                        }
                        console.log(response.data[0].value)
                        UVIndex.innerHTML = response.data[0].value;
                        UVIndexNow.innerHTML = "UV Index: ";
                        UVIndexNow.append(UVIndex);
                    });
                
                let citynameID = response.data.id;
                let futureForecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + citynameID + "&appid=" + APIKey;
                axios.get(futureForecastURL)
                    .then(function (response) {
                        fivedayFuture.classList.remove("d-none");
                        
                        const forecastFive = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastFive.length; i++) {
                            forecastFive[i].innerHTML = "";
                            const futureUVIndex = i * 8 + 4;
                            const futureDate = new Date(response.data.list[futureUVIndex].dt * 1000);
                            const futureDay = futureDate.getDate();
                            const futureMonth = futureDate.getMonth() + 1;
                            const futureYear = futureDate.getFullYear();
                            const futureDateEl = document.createElement("h5");
                            futureDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            futureDateEl.innerHTML = futureMonth + "/" + futureDay + "/" + futureYear;
                            forecastFive[i].append(futureDateEl);

                            const futureWeather = document.createElement("img");
                            futureWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[futureUVIndex].weather[0].icon + "@2x.png");
                            futureWeather.setAttribute("alt", response.data.list[futureUVIndex].weather[0].description);
                            forecastFive[i].append(futureWeather);

                            const futureTemp = document.createElement("p");
                            futureTemp.innerHTML = "Temp: " + random(response.data.list[futureUVIndex].main.temp) + " &#176F";
                            forecastFive[i].append(futureTemp);

                            const futureWindspeed = document.createElement("p");
                            futureWindspeed.innerHTML = "Wind: " + response.data.list[futureUVIndex].wind.speed + "MPH";
                            forecastFive[i].append(futureWindspeed);

                            const futureHumidity = document.createElement("p");
                            futureHumidity.innerHTML = "Humidity: " + response.data.list[futureUVIndex].main.humidity + "%";
                            forecastFive[i].append(futureHumidity);
                        }
                    })
            });
    }

    searchButton.addEventListener("click", function () {
        const searchItem = cityInput.value;
        displayWeather(searchItem);
        searchesEl.push(searchItem);
        localStorage.setItem("search", JSON.stringify(searchesEl));
        renderSearchesEl();
    })

    clearAll.addEventListener("click", function () {
        localStorage.clear();
        searchesEl = [];
        renderSearchesEl();
    })

    function random(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchesEl() {
        historySearch.innerHTML = "";
        for (let i = 0; i < searchesEl.length; i++) {
            const historySearchItem = document.createElement("input");
            historySearchItem.setAttribute("type", "text") ;
            historySearchItem.setAttribute("readonly", true);
            historySearchItem.setAttribute("class", "form-control d-block btn bg-secondary");
            historySearchItem.setAttribute("value", searchesEl[i]);
            historySearchItem.addEventListener("click", function () {
                displayWeather(historySearchItem.value);
            })
            historySearch.append(historySearchItem);
        }
    }

    renderSearchesEl();
    if (searchesEl.length > 0) {
        displayWeather(searchesEl[searchesEl.length - 1]);
    }
    
