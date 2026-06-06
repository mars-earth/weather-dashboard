import { AiOutlineCloseCircle } from "react-icons/ai";
import { WiTime4 } from "react-icons/wi";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog
} from "react-icons/wi";
import { WiThermometer, WiHumidity, WiStrongWind } from "react-icons/wi";
import { useState, useEffect } from "react";
import { getWeather, getForecast } from "./api/weather";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 👇 тригер для оновлення кожну секунду
  const [tick, setTick] = useState(0);

  // 🔄 оновлення кожну секунду
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
  if (!city) return;

  setLoading(true);
  setError("");

  try {
    const weatherData = await getWeather(city);
    const forecastData = await getForecast(city);

    setWeather(weatherData);
    setForecast(forecastData);
  } catch (error) {
  setWeather(null);
  setForecast(null);
  setError("City not found");

  setTimeout(() => {
    setError("");
  }, 3000);
}

  setLoading(false);
};
const resetDashboard = () => {
  setCity("");
  setWeather(null);
  setForecast(null);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  // 🕒 локальний час міста
  const getLocalTime = () => {
    if (!weather) return "";

    const now = new Date();

    const utc = now.getTime() + now.getTimezoneOffset() * 60000;

    const cityTime = new Date(utc + weather.timezone * 1000);

    return cityTime.toLocaleTimeString();
  };
  const getDailyForecast = () => {
  if (!forecast) return [];

  const days = {};

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];

    if (!days[date]) {
      days[date] = item;
    }
  });

  return Object.values(days).slice(0, 5);
};
const getWeatherIcon = () => {
  if (!weather) return null;

  const type = weather.weather[0].main;

  switch (type) {
    case "Clear":
      return <WiDaySunny />;
    case "Clouds":
      return <WiCloudy />;
    case "Rain":
      return <WiRain />;
    case "Snow":
      return <WiSnow />;
    case "Thunderstorm":
      return <WiThunderstorm />;
    case "Mist":
    case "Haze":
    case "Fog":
      return <WiFog />;
    default:
      return null;
  }
};
const getForecastIcon = (type) => {
  switch (type) {
    case "Clear":
      return <WiDaySunny />;
    case "Clouds":
      return <WiCloudy />;
    case "Rain":
      return <WiRain />;
    case "Snow":
      return <WiSnow />;
    case "Thunderstorm":
      return <WiThunderstorm />;
    case "Mist":
    case "Haze":
    case "Fog":
      return <WiFog />;
    default:
      return null;
  }
};
  return (
    <div className="container">
      <h1 onClick={resetDashboard} className="logo">
  Weather Dashboard
</h1>
      <p>Search weather anywhere in the world</p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={handleSearch} disabled={loading}>
  {loading ? "Loading..." : "Search"}
</button>
      </div>
      {error && (
  <div className="error-toast">
    <h2 className="error-title">
  <AiOutlineCloseCircle className="error-icon" />
  City not found
</h2>
    <p>Please check the spelling and try again.</p>
  </div>
)}
{weather && weather.main && (
  <div className="weather-grid">
    
    <div className="card main">
  <h2>
  <span className="weather-icon">{getWeatherIcon()}</span>
  {weather.name}
</h2>
  <p className="time">
  <WiTime4 className="time-icon" /> {getLocalTime()}
</p>
</div>

   <div className="card">
  <h3><WiThermometer /> Temperature</h3>
  <p>{weather.main.temp}°C</p>
</div>

<div className="card">
  <h3><WiHumidity /> Humidity</h3>
  <p>{weather.main.humidity}%</p>
</div>

<div className="card">
  <h3><WiStrongWind /> Wind</h3>
  <p>{weather.wind.speed} m/s</p>
</div>

  </div>
)}
      {forecast && (
  <div className="forecast-section">
    <h2>5-Day Forecast</h2>

    <div className="forecast-grid">
      {getDailyForecast().map((day, index) => (
        <div className="forecast-card" key={index}>
  <p className="forecast-date">
    {day.dt_txt.split(" ")[0]}
  </p>

  <div className="forecast-icon">
    {getForecastIcon(day.weather[0].main)}
  </div>

  <p className="forecast-temp">
    <WiThermometer className="forecast-icon-temp" />
    {Math.round(day.main.temp)}°C
  </p>

  <p className="forecast-type">
    {day.weather[0].main}
  </p>
</div>
      ))}
    </div>
  </div>
)}
<footer className="footer">
  <p className="footer-title">Weather Dashboard</p>
  <p className="footer-text">
    Built with React & OpenWeather API
  </p>
  <p className="footer-year">2026</p>
</footer>
    </div>
  );
}

export default App;