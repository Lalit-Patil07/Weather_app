import React from "react";

function formatTimeFromUnix(unixSeconds, timezoneOffsetSeconds = 0) {
  try {
    const date = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
    return date.toUTCString().replace("GMT", "UTC");
  } catch {
    return "-";
  }
}

function formatToIndian(unixSeconds) {
  try {
    const date = new Date(unixSeconds * 1000);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
  // Flatten all fields from the API JSON so we can display everything
  const flattened = [];
  function flatten(obj, parent = "") {
    if (obj === null || obj === undefined) {
      flattened.push({ key: parent || "(root)", value: String(obj) });
      return;
    }

    if (typeof obj !== "object") {
      const leafKey = parent.split(".").pop();
      // Format known unix timestamps to Indian time
      if (["sunrise", "sunset", "dt"].includes(leafKey) && typeof obj === "number") {
        flattened.push({ key: parent, value: formatToIndian(obj) });
      } else {
        flattened.push({ key: parent || "(root)", value: String(obj) });
      }
      return;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        flattened.push({ key: parent, value: "[]" });
      } else {
        obj.forEach((item, i) => flatten(item, `${parent}[${i}]`));
      }
      return;
    }

    const keys = Object.keys(obj);
    if (keys.length === 0) {
      flattened.push({ key: parent, value: "{}" });
      return;
    }
    keys.forEach((k) => flatten(obj[k], parent ? `${parent}.${k}` : k));
  }

  if (data) flatten(data, "");

  return (
    <div className="table-wrap">
      <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-100">
        <div className="flex gap-4 items-center mb-4">
          <div className="flex items-center gap-3">
            {iconUrl && (
              <img
                className="w-20 h-20"
                src={iconUrl}
                alt={weatherMain.description || "weather icon"}
                width="80"
                height="80"
              />
            )}
            <div className="text-4xl font-bold text-sky-600">
              {main.temp != null ? `${Math.round(main.temp)}°C` : "-"}
            </div>
          </div>

          <div className="flex-1">
            <div className="text-lg font-semibold text-slate-800">{name || "-"}</div>
            <div className="text-sm text-slate-500">{sys.country || ""}</div>
            <div className="text-sm text-slate-600 mt-2">
              {weatherMain.main || "-"} {weatherMain.description ? `— ${weatherMain.description}` : ""}
            </div>
          </div>
        </div>

        <table className="w-full text-sm">
          <tbody>
            <tr>
              <th className="text-slate-500 font-medium w-44 py-2">Coordinates</th>
              <td className="py-2">{coord.lat ?? "-"}, {coord.lon ?? "-"}</td>
            </tr>
            <tr>
              <th className="text-slate-500 font-medium py-2">Feels like</th>
              <td className="py-2">{main.feels_like != null ? `${main.feels_like} °C` : "-"}</td>
            </tr>
            <tr>
              <th className="text-slate-500 font-medium py-2">Humidity</th>
              <td className="py-2">{main.humidity != null ? `${main.humidity} %` : "-"}</td>
            </tr>
            <tr>
              <th className="text-slate-500 font-medium py-2">Pressure</th>
              <td className="py-2">{main.pressure != null ? `${main.pressure} hPa` : "-"}</td>
            </tr>
            <tr>
              <th className="text-slate-500 font-medium py-2">Wind</th>
              <td className="py-2">{wind.speed != null ? `${wind.speed} m/s` : "-"} {wind.deg != null ? `@ ${wind.deg}°` : ""}</td>
            </tr>
            <tr>
              <th className="text-slate-500 font-medium py-2">Clouds</th>
              <td className="py-2">{clouds.all != null ? `${clouds.all} %` : "-"}</td>
            </tr>
            <tr>
              <th className="text-slate-500 font-medium py-2">Visibility</th>
              <td className="py-2">{visibility != null ? `${visibility} m` : "-"}</td>
            </tr>
            <tr>
              <th className="text-slate-500 font-medium py-2">Sunrise (IST)</th>
              <td className="py-2">{sys.sunrise ? formatToIndian(sys.sunrise) : "-"}</td>
            </tr>
            <tr>
              <th className="text-slate-500 font-medium py-2">Sunset (IST)</th>
              <td className="py-2">{sys.sunset ? formatToIndian(sys.sunset) : "-"}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4">
          <details className="raw-json">
            <summary className="text-sky-600 font-medium cursor-pointer">Raw JSON</summary>
            <pre className="mt-2">{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}



