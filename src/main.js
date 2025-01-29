const weatherForm = document.querySelector(".weather-form");
const cityInput = document.querySelector(".city-input");
const card = document.querySelector(".card");

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;

    if (city) {
        try {
            const cityData = await getCityData(city);
            displayWeatherInfo(cityData);
        }
        catch (err) {
            console.error(err);
            displayError(err);
        }
    }
    else {
        displayError("Please enter a city");
    }
});

async function getCityData(city) {
    const apiGeoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    const response = await fetch(apiGeoUrl);

    if (!response.ok) {
        throw new Error("Could not fetch city data");
    }

    const data =  await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }

    return data.results[0];
}

async function displayWeatherInfo(result) {
    const latitude = result.latitude;
    const longitude = result.longitude;

    const weatherurl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
        const response = await fetch(weatherurl);
        if (!response.ok) {
            throw new Error("Could not fetch weather data");
        }

        const weatherData = await response.json();
        console.log(weatherData);

        const temperature = weatherData.current_weather.temperature;
        const windSpeed = weatherData.current_weather.windspeed;
        const windDirection = weatherData.current_weather.winddirection;

        card.textContent = "";
        card.style.display = "flex";

        const cityDisplay = document.createElement("h1");
        const tempDisplay = document.createElement("p");
        const windSpeedDisplay = document.createElement("p");
        const windDirectionDisplay = document.createElement("p");

        cityDisplay.textContent = cityInput.name;
        tempDisplay.textContent = `Temperature ${temperature}°C`;
        windSpeedDisplay.textContent = `Wind Speed ${windSpeed}km/h`;
        windDirectionDisplay.textContent = `Wind Direction ${windDirection}°`;

        cityDisplay.classList.add("city-display");
        tempDisplay.classList.add("temp-display");
        windSpeedDisplay.classList.add("wind-spd-display");
        windDirectionDisplay.classList.add("wind-dir-display");

        card.appendChild(cityDisplay);
        card.appendChild(tempDisplay);
        card.appendChild(windSpeedDisplay);
        card.appendChild(windDirectionDisplay);

    }
    catch (err) {
        console.error(err);
        displayError(err);
    }
}

function displayError(msg) {
    const errDisplay = document.createElement("p");
    errDisplay.textContent = msg;
    errDisplay.classList.add("error-display");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errDisplay);
}