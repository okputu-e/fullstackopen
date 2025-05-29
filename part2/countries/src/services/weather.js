import axios from "axios";
const apiKey = import.meta.env.VITE_SOME_KEY;

const baseUrl = `https://api.openweathermap.org/data/2.5/weather`;

const getCapitalWeather = async (capital) => {
  const request = axios.get(baseUrl, {
    params: {
      q: capital,
      appid: apiKey,
      units: "metric",
    },
  });
  const response = await request;
  return response.data;
};

export default { getCapitalWeather };
