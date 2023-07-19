
import _fetch from "isomorphic-fetch";

export async function GetCurrentWeather(lat,lon){
    
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_OWM_KEY}&units=metric`)
    const data= await res.json();
    const main_body = data.main
    const temp = main_body.temp;
    const feels_like = main_body.feels_like;
    const main_description = data.weather[0].main
    const second_description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const min_temp = main_body.temp_min;
    const max_temp = main_body.temp_max;
    const pressure = main_body.pressure;
    const humidity = main_body.humidity;
    const wind_speed = data.wind.speed;
    const wind_degree = data.wind.deg;
    const country = data.sys.country;
    const toffset =  new Date().getTimezoneOffset() * 60;
    const place_timezone = data.timezone;
    const zone_difference = toffset + place_timezone;
    const dt = new Date((data.dt +zone_difference) * 1000).toLocaleString("en-US");
    const sunrise = new Date((data.sys.sunrise + zone_difference) * 1000).toLocaleTimeString();
    const sunset = new Date((data.sys.sunset + zone_difference) * 1000).toLocaleTimeString();
    
    return {dt,sunrise,sunset, country, temp, feels_like, min_temp, max_temp,pressure,humidity,main_description,second_description,icon,wind_speed,wind_degree};
}

export async function GetMinMaxTemp(lat,lon){

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_OWM_KEY}&units=metric`)
    const data= await res.json();
    const main_body = data.main;
    const min_temp = main_body.temp_min;
    const max_temp = main_body.temp_max;
    
    return{min_temp, max_temp};
}


export async function getCountry(lat, lon){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_OWM_KEY}&units=metric`)
    const data= await res.json();
    const country = data.sys.country;
    return {country};
}