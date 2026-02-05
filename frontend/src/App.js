import React, { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {

  navigator.geolocation.getCurrentPosition(async (position) => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {

      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/weatherByCoords?lat=${lat}&lon=${lon}`
      );

      const data = await response.json();

      setWeather(data);
      setLoading(false);

    } catch {

      setLoading(false);
    }

  });

}, []);



const getWeather = async () => {

  if (!city) {
    setError("Please enter a city name");
    return;
  }

  try {

    setLoading(true);
    setError("");

    const response = await fetch(
      `http://localhost:5000/weather?city=${city}`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      setError("City not found");
      setWeather(null);
    } else {
      setWeather(data);
    }

    setLoading(false);

  } catch (err) {

    setError("Failed to fetch weather");
    setLoading(false);
  }
};


  return (
  <div className={`container ${
    weather?.weather[0].main === "Clear"
      ? "clear"
      : weather?.weather[0].main === "Clouds"
      ? "cloudy"
      : weather?.weather[0].main === "Rain"
      ? "rainy"
      : "default"
  }`}>


      <h1>Weather App</h1>

      <input
        autoFocus
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && getWeather()}
      />

      <button onClick={getWeather}>Get Weather</button>

      {loading && <p>Loading weather data...</p>}

      {error && <p className="error">{error}</p>}

      {weather && weather.main && (
        <div className="weather-box">

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
           alt="weather icon"
          />


          <h2>{weather.name}</h2>
          <p>🌡 Temperature: {weather.main.temp} °C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>☁ Condition: {weather.weather[0].description.toUpperCase()}</p>
          <p>🌬 Wind Speed: {weather.wind.speed} m/s</p>

        </div>
      )}

    </div>
  );
}

export default App;
