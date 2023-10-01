import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [haku, laitaHaku] = useState('');
  const [maat, setMaat] = useState([]);
  const [valittuMaa, laitaValittuMaa] = useState(null);
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [saa, laitaSaa] = useState([])
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (haku) {
      console.log('fetching countries...');
      axios
        .get(`https://restcountries.com/v3.1/name/${haku}`)
        .then((response) => {
          setMaat(response.data);
          if (response.data.length > 0) {
          const uusLat = response.data[0]?.latlng[0];
          const uusLon = response.data[0]?.latlng[1];
          setLat(uusLat);
          setLon(uusLon);
          weatherCall(uusLat, uusLon);
          }
        })
        .catch((error) => {
          console.error('Error fetching countries:', error);
        });
    }
  }, [haku]);




  const handleChange = (event) => {
    laitaHaku(event.target.value.toLowerCase());
    laitaValittuMaa(null);
  };

  const onSearch = (event) => {
    event.preventDefault();
    laitaHaku('');
    laitaValittuMaa(null);
  };

  const naytaMaa = (country) => {
    laitaValittuMaa(country);
  }

  const weatherCall = (lat, lon) => {
    console.log('fetching weather...');
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
      .then((response) => {
        laitaSaa(response.data)
      })
      .catch((error) => {
        console.error('Error fetching weather:', error);
      })
  }

  const WeatherInfo = ({ weather }) => {
    if (weather) {
      const lampotila = (weather.main.temp - 272.15).toFixed(1);
      return (
        <div>
          <h2>Weather in {maat[0].capital} </h2>
          <p> Temperature: {lampotila}°C </p>
          <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
          <p> Wind: {weather.wind.speed} m/s </p>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <form onSubmit={onSearch}>
        find countries: <input value={haku} onChange={handleChange} />
        <button type="submit">Search</button>
      </form>
      <pre>
        {valittuMaa ? (
          <div key={valittuMaa.name.common}>
            <h2>{valittuMaa.name.common}</h2>
            <p>Capital: {valittuMaa.capital}</p>
            <p>Population: {valittuMaa.population}</p>
            <p>Languages:</p>
            <ul>
              {Object.values(valittuMaa.languages).map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
            <img src={valittuMaa.flags.png} alt={`${valittuMaa.name.common} flag`} />
            <WeatherInfo weather={saa} />
          </div>
        ) : maat.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : maat.length <= 10 && maat.length > 1 ? (
          maat.map((maa) => (
            <div key={maa.name.common}>
              <p>
                {maa.name.common}{' '}
                <button
                  type="button"
                  onClick={() => naytaMaa(maa)}>show</button>{' '}
              </p>
            </div>
          ))
        ) : maat.length === 1 ? (
          <div key={maat[0].name.common}>
            <h2>{maat[0].name.common}</h2>
            <p>Capital: {maat[0].capital}</p>
            <p>Population: {maat[0].population}</p>
            <p>Languages:</p>
            <ul>
              {Object.values(maat[0].languages).map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
            <img src={maat[0].flags.png} alt={`${maat[0].name.common} flag`} />
            <WeatherInfo weather={saa} />
          </div>

        ) : null}
      </pre>
    </div>
  );
};
export default App;