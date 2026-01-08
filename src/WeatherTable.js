import React from "react";

function formatTimeFromUnix(unixSeconds, timezoneOffsetSeconds = 0) {
  try {
    const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
    return date.toUTCString().replace("GMT", "UTC");
  } catch {
    return "-";
  }
}

export default function WeatherTable({ data }) {
  const {
    name,
    sys = {},
    main = {},
    wind = {},
    weather = [],
    coord = {},
    clouds = {},
    visibility,
    timezone,
  } = data || {};

  const weatherMain = weather[0] || {};
  const iconCode = weatherMain.icon;
  const iconUrl = iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : null;

  return (
    <div className="table-wrap">
      <div className="weather-card">
        <div className="weather-card-top">
          <div className="weather-left">
            {iconUrl && (
              <img
                className="weather-icon"
                src={iconUrl}
                alt={weatherMain.description || "weather icon"}
                width="80"
                height="80"
              />
            )}
            <div className="temp-big">
              {main.temp != null ? `${Math.round(main.temp)}°C` : "-"}
            </div>
          </div>

          <div className="weather-right">
            <div className="city-name">{name || "-"}</div>
            <div className="country">{sys.country || ""}</div>
            <div className="description">
              {weatherMain.main || "-"} {weatherMain.description ? `— ${weatherMain.description}` : ""}
            </div>
          </div>
        </div>

        <table className="weather-table">
          <tbody>
            <tr>
              <th>Coordinates</th>
              <td>
                {coord.lat ?? "-"}, {coord.lon ?? "-"}
              </td>
            </tr>
            <tr>
              <th>Feels like</th>
              <td>{main.feels_like != null ? `${main.feels_like} °C` : "-"}</td>
            </tr>
            <tr>
              <th>Humidity</th>
              <td>{main.humidity != null ? `${main.humidity} %` : "-"}</td>
            </tr>
            <tr>
              <th>Pressure</th>
              <td>{main.pressure != null ? `${main.pressure} hPa` : "-"}</td>
            </tr>
            <tr>
              <th>Wind</th>
              <td>
                {wind.speed != null ? `${wind.speed} m/s` : "-"} {wind.deg != null ? `@ ${wind.deg}°` : ""}
              </td>
            </tr>
            <tr>
              <th>Clouds</th>
              <td>{clouds.all != null ? `${clouds.all} %` : "-"}</td>
            </tr>
            <tr>
              <th>Visibility</th>
              <td>{visibility != null ? `${visibility} m` : "-"}</td>
            </tr>
            <tr>
              <th>Sunrise (UTC)</th>
              <td>{sys.sunrise ? formatTimeFromUnix(sys.sunrise, 0) : "-"}</td>
            </tr>
            <tr>
              <th>Sunset (UTC)</th>
              <td>{sys.sunset ? formatTimeFromUnix(sys.sunset, 0) : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


