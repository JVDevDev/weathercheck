import { useEffect, useState } from 'react';
import './App.css';

function App(){
  const [search, setSearch] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [cidade, setCidade] = useState("");

  function searchInput(event) {
    if(event.target.value != null || event.target.value !== ""){
      setSearch(event.target.value)
    }
  }
  
  async function searchingCity(cidade){
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    const result = data.results[0]
    return {
      name: result.name || "",
      lat: result.latitude,
      lon: result.longitude
    }
  }

  async function getWeather(cidade) {
    const { lat, lon, name } = await searchingCity(cidade);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min`);
    const res = await fetch(url)
    const data = await res.json()
    return {
      name,
      current:data.current,
      hourly
    }
  }

  useEffect(() =>{
    function isSearching(){
      if(newSearch === search){
        return
      } else{
        if(search !== ""){
          setNewSearch(search)
          getWeather(newSearch)
        }
      }
    }
    const time = setInterval(isSearching, 3000)
    return () => clearInterval(time)  
  },[newSearch, search])
  return(
    <div>
      <div className='search'>
        <h2>Digite a cidade da qual queira saber a previsão...</h2>
        <input type='text' name='searchInput' onChange={searchInput}/>
      </div>
      {cidade !== "" ? 
      <div dangerouslySetInnerHTML={{__html:cidade}} />: 
      <div className='cidadePesquisada'>Procure por uma cidade para buscar informações...</div>
      }
    </div>
  )
}

export default App;