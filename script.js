const apiKey = ''; // Replace with your OpenWeatherMap API Key

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherBox = document.getElementById("weatherBox");

  if (!city) {
    weatherBox.innerHTML = `<p class="instruction">Please enter a city name</p>`;
    return;
  }

  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentURL),
      fetch(forecastURL)
    ]);

    if (!currentRes.ok || !forecastRes.ok) throw new Error();

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const { name } = currentData;
    const { temp, humidity } = currentData.main;
    const weatherDescription = currentData.weather[0].main;
    const iconCode = currentData.weather[0].icon;
    const iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const windSpeed = currentData.wind.speed;
    const date = new Date().toDateString();

    const forecasts = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);


    weatherBox.innerHTML = `
      <h2>${name}</h2>
      <p>${date}</p>
      <img src="${iconURL}" alt="Weather Icon" width="80"/>
      <h1>${Math.round(temp)}°C</h1>
      <p>${weatherDescription}</p>
      
      <!-- ✅ Added icons below -->
      <p>💧 Humidity: ${humidity}%</p>
      <p>🌬️ Wind Speed: ${windSpeed} m/s</p>

      <div class="forecast">
        ${forecasts.map(day => {
          const date = new Date(day.dt_txt).toDateString().split(' ').slice(1, 3).join(' ');
          const icon = day.weather[0].icon;
          const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
          return `
            <div class="forecast-item">
              <p>${date}</p>
              <img src="${iconURL}" alt="Forecast Icon" width="50"/>
              <p>${Math.round(day.main.temp)}°C</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (err) {
    weatherBox.innerHTML = `<p class="instruction">City not found. Try again.</p>`;
  }
}
