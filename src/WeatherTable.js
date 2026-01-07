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

  return (
    <div className="table-wrap">
      <table className="weather-table">
        <tbody>
          <tr>
            <th>City</th>
            <td>{name || "-"}</td>
          </tr>
          <tr>
            <th>Country</th>
            <td>{sys.country || "-"}</td>
          </tr>
          <tr>
            <th>Coordinates</th>
            <td>
              {coord.lat ?? "-"}, {coord.lon ?? "-"}
            </td>
          </tr>
          <tr>
            <th>Weather</th>
            <td>
              {weatherMain.main || "-"} — {weatherMain.description || "-"}
            </td>
          </tr>
          <tr>
            <th>Temperature</th>
            <td>{main.temp != null ? `${main.temp} °C` : "-"}</td>
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
              {wind.speed != null ? `${wind.speed} m/s` : "-"}{" "}
              {wind.deg != null ? `@ ${wind.deg}°` : ""}
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
  );
}


