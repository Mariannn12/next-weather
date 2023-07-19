import _fetch from "isomorphic-fetch";

export default async function get4DaysForecast(lat,lon){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=639f56e38455263cc28aafbccbe65a1c&units=metric`)
    const data = await res.json();

    const forecasts = []
    var items = data.list;

    for(var i = 0; i<items.length;i+=4){
        var item_date = items[i].dt_txt
        var main = items[i].weather[0].main
        var description = items[i].weather[0].description
        var temp = items[i].main.temp
        var humidity = items[i].main.humidity
        var pressure = items[i].main.pressure
        var wind_speed = items[i].wind.speed
        var icon = items[i].weather[0].icon
        
        forecasts.push({

            date : item_date.slice(0,item_date.indexOf(' ')),
            main : main,
            description : description,
            temperature: temp,
            humidity : humidity,
            pressure : pressure,
            windspeed : wind_speed,
            icon : icon

        })
        
    }

   return forecasts;
}