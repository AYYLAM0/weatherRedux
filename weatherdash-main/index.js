var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var cityName = $("#city-name");
var currentTemp = $("#temperature");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#wind-speed");
var currentUV = $("#UV-index");
var enterCity = $("#enter-city");
var oneDay = document.querySelector(".one-day");
var fiveDay = document.querySelector(".five-day");
var city = "";
var searchedCity = [];

searchButton.click(weather);

function weather(event) {
    event.preventDefault();
    if (enterCity.val().trim() !== "") {
        city = enterCity.val().trim();
        currentWeather(city);
        oneDay.classList.remove("d-none");
        fiveDay.classList.remove("d-none");
    }
}
y
function currentWeather(city) {
    console.log(city)
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=5491dc29057d33e044fdc60889703c0f&lang=en";

    fetch(apiURL)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    console.log(data)
                    var date = new Date(data.dt * 1000).toLocaleDateString();
                    cityName.html(data.name + "(" + date + ")" + "<img src=" + iconURL + ">");
                    currentTemp.html(data.main.temp + "°F");
                    currentHumidity.html(data.main.humidity + "%");
                    currentWindSpeed.html(data.wind.speed + "MPH");
                    UVIndex(data.coord.lon, data.coord.lat);
                    fiveDay(data.id)
                    if (data.cod == 200) {
                        searchedCity = JSON.parse(localStorage.getItem("cityname"));
                        console.log(searchedCity);
                        if (searchedCity == null) {
                            searchedCity = [];
                            searchedCity.push(city.toUpperCase());
                            localStorage.setItem("cityname", JSON.stringify(searchedCity));
                            addToHistory(city);
                        }
                        else {
                            if (find(city) > 0) {
                                searchedCity.push(city.toUpperCase());
                                localStorage.setItem("cityname", JSON.stringify(searchedCity));
                                addToHistory(city);
                            }
                        }
                    }

                })
        })
}
function UVIndex(latitude, longitude) {
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=5491dc29057d33e044fdc60889703c0f&lat=" + latitude + "&lon=" + longitude;

    fetch(uvURL)
        .then(function (response) {
            response.json()
                .then(function (response) {
                    console.log(response);
                    currentUV.html(response.value);

                    var badgeColor = document.querySelector("#UV-index")
                if (response.value < 2 ) {
                    badgeColor.classList.add("badge", "bg-success");
                    badgeColor.classList.remove("badge", "bg-warning");
                    badgeColor.classList.remove("badge", "bg-danger");
                }
                else if (response.value > 2 && response.value < 5) {
                    badgeColor.classList.add("badge", "bg-warning");
                    badgeColor.classList.remove("badge", "bg-danger");
                    badgeColor.classList.remove("badge", "bg-success");
                }
                else {
                    badgeColor.classList.add("badge", "bg-danger");
                    badgeColor.classList.remove("badge", "bg-success");
                    badgeColor.classList.remove("badge", "bg-warning");
                }

                })       
        })
}
function fiveDayweather(id) {
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + id + "&units=imperial&appid=5491dc29057d33e044fdc60889703c0f&lang=en";

    fetch(fiveDayURL)
        .then(function (response) {
            response.json()
                .then(function (data) {
                    console.log(data);
                    for (i = 0; i < 5; i++) {
                        var fiveDate = new Date((data.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
                        var fiveTemp = data.list[((i + 1) * 8) - 1].main.temp;
                        var fiveHumidity = data.list[((i + 1) * 8) - 1].main.humidity;

                        $("#fiveDate" + i).html(fiveDate);
                        $("#fiveTemp" + i).html(fiveTemp + "°F");
                        $("#fiveHumidity" + i).html(fiveHumidity + "%");
                    }
                })
        })
}