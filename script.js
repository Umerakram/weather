const inputBox = document.querySelector(".input-box");
const searchBtn = document.getElementById("searchBtn");
const weather_img = document.querySelector(".weather-img");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.getElementById("humidity");
const wind_speed = document.getElementById("wind-speed");
//error message when the location is not found
const location_not_found = document.querySelector(".location-not-found");
const weather_body = document.querySelector(".weather-body");

const api_key = "0046c6351627e2663fdfa4bf830156dd";
const cacheTimeout = 3600000; // 1 hour cache timeout

async function checkWeather(city) {
  //Cache key creation
  const cacheKey = `weather-${city}`;
  //Check if cache exists
  const cachedData = localStorage.getItem(cacheKey);
  //Cache validation
  if (cachedData) {
    const cachedDataJSON = JSON.parse(cachedData);
    if (cachedDataJSON.timestamp + cacheTimeout > Date.now()) {
      // Cache is valid, load from cache
      console.log("Loading from cache");
      displayWeatherData(cachedDataJSON.data);
      return;
    } else {
      // Cache is expired, remove it
      localStorage.removeItem(cacheKey);
    }
  }
  // no valid cache this code makes an API call
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

  try {
    const response = await fetch(url);
    const weatherData = await response.json();

    if (weatherData.cod === "404") {
      location_not_found.style.display = "flex";
      weather_body.style.display = "none";
      console.log("error");
      return;
    }

    console.log("run");
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    //This code creates a cache entry by storing the weather data and the current timestamp in localStorage using setItem.
    const dataToCache = {
      data: weatherData,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

    displayWeatherData(weatherData);
  } catch (error) {
    console.error(error);
  }
}

function displayWeatherData(weatherData) {
  temperature.innerHTML = `${Math.round(weatherData.main.temp - 273.15)}°C`;
  description.innerHTML = `${weatherData.weather[0].description}`;

  humidity.innerHTML = `${weatherData.main.humidity}%`;
  wind_speed.innerHTML = `${weatherData.wind.speed}Km/H`;

  switch (weatherData.weather[0].main) {
    case "Clouds":
      weather_img.src = "/assets/cloud.png";
      break;
    case "Clear":
      weather_img.src = "/assets/clear.png";
      break;
    case "Rain":
      weather_img.src = "/assets/rain.png";
      break;
    case "Mist":
      weather_img.src = "/assets/mist.png";
      break;
    case "Snow":
      weather_img.src = "/assets/snow.png";
      break;
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(inputBox.value);
});
