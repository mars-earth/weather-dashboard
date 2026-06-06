const API_KEY = import.meta.env.VITE_API_KEY;

export async function getWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "City not found");
  }

  return data;
}
export async function getForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "City not found");
  }

  return data;
}