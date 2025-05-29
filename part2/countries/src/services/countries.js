import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const getAll = async () => {
  const resquest = axios.get(baseUrl);
  const response = await resquest;
  return response.data;
};

export default { getAll };
