//Current Date
var date = moment().format("MM/DD/YYYY");

//Submit Button
var submitButtonEl = document.querySelector("#submit-btn");
submitButtonEl.addEventListener("click", function (event) {
  event.preventDefault();

  //Obtain City Name from Search Input
  var cityName = document.querySelector("#city-input").value.trim();
  console.log(cityName);
  displayTodaysWeather(cityName);
  saveCity(cityName);
});

//Current Weather Fetch 
function displayTodaysWeather(cityName) {
  var todaysWeatherEl = document.querySelector("#todays-weather");
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${"ccac201dbe029ae3f143bec998aeffb5"}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      todaysWeatherEl.innerHTML = `
        <h3>${data.name} (${date})</h3>
        <p>Temperature: ${data.main.temp} F </p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} mph</p>
       `;
      console.log(data);

      var lat = data.coord.lat;
      var lon = data.coord.lon;
 
      fiveDayDisplay(lat, lon);

      //UI Index Fetch
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${"ccac201dbe029ae3f143bec998aeffb5"}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data2) {
          todaysWeatherEl.innerHTML += `<p>UV Index: ${data2.current.uvi}</p>`;
        });
    });
}

//Five Day Weather Fetch
function fiveDayDisplay(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${"ccac201dbe029ae3f143bec998aeffb5"}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      document.querySelector("#week-weather").innerHTML = "";
      for (var i = 1; i < 6; i++) {
        //Inter HTML for display of Five Day Weather
        document.querySelector("#week-weather").innerHTML += `
            <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
              <div class="card-header">${moment
                .unix(data.daily[i].dt)
                .format("MM/DD/YYYY")} </div>
              <div class="card-body">
              <h5 class="card-title"><img src="http://openweathermap.org/img/wn/${
                data.daily[i].weather[0].icon
              }@2x.png" /> </h5>
              <p class= "card-text"> Temp: ${data.daily[i].temp.day}</p>
              <p class= "card-text"> Humidity: ${data.daily[i].humidity}</p>
                </div>
              `;
      }
    });
}

//Save Data for Cities
function loadCities() {
  document.querySelector("#city-list").innerHTML = "";
  var cityArray = JSON.parse(localStorage.getItem("cities"));

  cityArray.forEach((city)=> {
     document.querySelector("#city-list").innerHTML += `<li class="list-group-item city-item">${city}</li>`
  }) 
  document.querySelectorAll(".city-item").forEach((city) => {
      city.addEventListener("click", function (event) {
        event.preventDefault();
        var cityName = this.textContent
        displayTodaysWeather(cityName);
      });
  })
}

function saveCity(cityName) {
  //create local storage with empty array
  if (!localStorage.getItem("cities")) {
    localStorage.setItem("cities", JSON.stringify([]));
  }
  var cityArray = JSON.parse(localStorage.getItem("cities"));
  cityArray.push(cityName);
  localStorage.setItem("cities", JSON.stringify(cityArray));
  loadCities();
}
loadCities();