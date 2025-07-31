// ------------------------------
// 2. Weather Forecast Dashboard
// ------------------------------

// File: src/WeatherDashboard.tsx
import React, { useEffect, useState } from "react";

const API_KEY = "e43de6f699ca2633a21f6517ae74d8b0";
const CITY = "Little Rock";

interface WeatherData {
  date: string;
  temp: number;
  icon: string;
  description: string;
}

const WeatherDashboard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (!response.ok || !data.list || !Array.isArray(data.list)) {
        throw new Error(data.message || "Invalid API response");
      }

      const dailyForecasts = data.list.filter((item: any) =>
        item.dt_txt.includes("12:00:00")
      );

      const formattedData: WeatherData[] = dailyForecasts.map((item: any) => ({
        date: item.dt_txt.split(" ")[0],
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      }));

      setWeather(formattedData);
    } catch (err: any) {
      console.error("Weather API error:", err);
      setError(
        "Failed to fetch weather data. Please check your API key or city."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className="weather-dashboard">
      <h1>5-Day Weather Forecast: {CITY}</h1>

      {loading && <p>Loading weather data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {weather.map((day) => (
          <div
            key={day.date}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              textAlign: "center",
              minWidth: "120px",
            }}
          >
            <h3>{day.date}</h3>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description}
              title={day.description}
            />
            <p>{day.temp}°C</p>
            <p style={{ textTransform: "capitalize" }}>{day.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDashboard;
