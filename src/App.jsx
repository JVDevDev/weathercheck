import { useEffect, useState } from 'react';
import './App.css';

function App(){
  const [search, setSearch] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [temperature, setTemperature] = useState("");
  const [isDay, setIsDay] = useState("");

  function searchInput(event) {
    if(event.target.value != null || event.target.value !== ""){
      setSearch(event.target.value)
    }
  }
  
  async function searchingCity(cidade){
    const url = (`https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=10&language=en&format=json`);
    const res = await fetch(url);
    const data = await res.json();
    const result = data.results[0];
    setName(result.name)
    return {
      lat: result.latitude,
      lon: result.longitude
    }
  }
  
  async function getWeather(newSearch) {
    const { lat, lon } = await searchingCity(newSearch)
    const url = (`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=is_day,temperature_2m&timezone=auto`)
    const res = await fetch(url);
    const data = await res.json()
    setTimezone(`${data.timezone_abbreviation} - ${data.timezone}`)
    setTemperature(`${data.current.temperature_2m} ${data.current_units.temperature_2m}`)
    setIsDay(data.current.is_day)
  }

  async function isSearching(){
    if(newSearch === search){
      if(newSearch !== ""){
        getWeather(newSearch)
      }
    }else{
      setNewSearch(search)
    }
  }
  useEffect(() =>{
    const time = setInterval(isSearching, 3000)
    return () => clearInterval(time)  
  },[newSearch, search])
  return(
    <div>
      <div className='search'>
        <h2>Digite a cidade da qual queira saber a previsão...</h2>
        <input type='text' name='searchInput' onChange={searchInput}/>
      </div>
      <div>
        <h2>{name}</h2>
        <h2>{timezone}</h2>
        <h2>{temperature}</h2>
      </div>
    </div>
  )
}

export default App;