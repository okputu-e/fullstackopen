import { useEffect, useState } from "react";
import countriesServices from "./services/countries";
import weatherServices from "./services/weather";

const App = () => {
  const [countriesList, setCountriesList] = useState([]);
  const [findCountry, setFindCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countriesServices.getAll().then((countriesInfo) => {
      setCountriesList(countriesInfo);
    });
  }, []);

  const countriesFilter = countriesList.filter((countries) =>
    countries.name.common.toLowerCase().includes(findCountry.toLowerCase())
  );

  useEffect(() => {
    const country =
      selectedCountry?.[0] ||
      (countriesFilter.length === 1 && countriesFilter[0]);

    if (!country) return; // early return to avoid infinite loop
    const capital = country.capital[0];

    if (weather?.name?.toLowerCase() === capital.toLowerCase()) return; // early return to avoid infinite loop

    weatherServices.getCapitalWeather(capital).then((data) => setWeather(data));

    // const country =
    //   (selectedCountry && selectedCountry[0]) ||
    //   (countriesFilter.length === 1 && countriesFilter[0]);

    // if (country) {
    //   const capital = country.capital[0];
    //   console.log(capital);
    //   weatherServices
    //     .getCapitalWeather(capital)
    //     .then((data) => setWeather(data));
    // } Refactored my code from this.
  }, [selectedCountry, countriesFilter]);

  const showCountryInfo = (name) => {
    return name.map((country) => (
      <section key={country.name.common}>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={country.name.common + " flag"} />
      </section>
    ));
  };

  let countriesEl = "";

  if (findCountry !== "") {
    if (countriesFilter.length > 10) {
      countriesEl = "Too many matches, specify another filter";
    } else {
      if (countriesFilter.length === 1) {
        countriesEl = showCountryInfo(countriesFilter);
      } else {
        countriesEl = countriesFilter.map((countries) => (
          <p key={countries.name.common}>
            {countries.name.common}{" "}
            <button onClick={() => setSelectedCountry([countries])}>
              show
            </button>
          </p>
        ));
      }
    }
  }

  const handleFindCountries = (event) => {
    setFindCountry(event.target.value);
    setSelectedCountry(null);
    setWeather(null);
  };

  return (
    <main>
      <label>
        find countries{" "}
        <input value={findCountry} onChange={handleFindCountries} />
      </label>

      {selectedCountry ? (
        showCountryInfo(selectedCountry)
      ) : (
        <section className="countries">{countriesEl}</section>
      )}

      {weather && (
        <section>
          <h2>Weather in {weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </section>
      )}
    </main>
  );
};

export default App;
