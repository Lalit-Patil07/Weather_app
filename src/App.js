import React, { useState } from "react";
import WeatherTable from "./WeatherTable";

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(event) {
    event.preventDefault();
    if (!city) return;
    setLoading(true);
    setError(null);
    setWeatherData(null);

    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError("Missing OpenWeather API key. Set REACT_APP_OPENWEATHER_API_KEY in .env");
      setLoading(false);
      return;
    }

    try {
      const encodedCity = encodeURIComponent(city.trim());
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${apiKey}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.message || "Failed to fetch weather");
      }
      const data = await resp.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Weather Search (OpenWeather)</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          aria-label="city"
          placeholder="Enter city name (e.g. London)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {weatherData && <WeatherTable data={weatherData} />}
    </div>
  );
}


