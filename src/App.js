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
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Weather Search (OpenWeather)</h1>

        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            aria-label="city"
            placeholder="Enter city name (e.g. London)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-sky-600 text-white rounded-md disabled:opacity-60"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {weatherData && <WeatherTable data={weatherData} />}
      </div>
    </div>
  );
}


