const apiKey = '502815f1d8855c683339b043fe44d2cd';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('search-history');
let searchHistory = [];

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city !== '') {
        getWeather(city);
    }
});

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            addCityToHistory(city);
            getForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.error('Error fetching current weather:', error));
}

function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => displayForecast(data.daily))
        .catch(error => console.error('Error fetching forecast:', error));
}

function displayCurrentWeather(data) {
    currentWeatherDiv.innerHTML = `
        <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">
    `;
}

function displayForecast(forecastData) {
    forecastDiv.innerHTML = '<h2>5-Day Forecast:</h2>';
    forecastData.slice(1, 6).forEach(day => {
        forecastDiv.innerHTML += `
            <div>
                <p>Date: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${day.temp.day}°C</p>
                <p>Humidity: ${day.humidity}%</p>
                <p>Wind Speed: ${day.wind_speed} m/s</p>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon">
            </div>
        `;
    });
}

function addCityToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        updateSearchHistory();
    }
}

function updateSearchHistory() {
    searchHistoryDiv.innerHTML = '<h2>Search History:</h2>';
    searchHistory.forEach(city => {
        searchHistoryDiv.innerHTML += `<p><a href="#" onclick="getWeather('${city}')">${city}</a></p>`;
    });
}