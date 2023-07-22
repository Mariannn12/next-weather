export const config = {
    runtime: 'edge',
  };
export default async function handler(req,res){

    const {lat, lon} = req.query

    try{
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_OWM_KEY}&units=metric`)
        const data = await response.json()
   
        res.status(200).json({current : await Current_Weather(data), daily : await Daily_Weather(data), hourly : await Hourly_Weather(data), alerts : await Alerts_Weather(data)})
    }catch(error){
        res.status(500).json({message : error})
    }
    
}

async function Current_Weather(response){

    const data = await response
    const main_body = data.current;
    const temp = main_body.temp;
    const feels_like = main_body.feels_like;
    const main_description = main_body.weather[0].main;
    const second_description = main_body.weather[0].description;
    const icon = main_body.weather[0].icon;
    const pressure = main_body.pressure;
    const humidity = main_body.humidity;
    const wind_speed = main_body.wind_speed;
    const wind_degree = main_body.wind_deg;
    const timezone_offset = data.timezone_offset;
    const toffset = new Date().getTimezoneOffset() * 60;
    const zone_difference = toffset + timezone_offset;
    const sunrise = new Date((main_body.sunrise + zone_difference) * 1000).toLocaleString("en-US");
    const sunset = new Date((main_body.sunset + zone_difference) * 1000).toLocaleString("en-US");
    const dew_point = main_body.dew_point;
    const uvi = main_body.uvi;
    const clouds = main_body.clouds;
    
    const dt = new Date((main_body.dt + zone_difference) * 1000).toLocaleString("en-US");
    return {dt, sunrise, sunset, temp ,feels_like, main_description, second_description, icon,pressure, humidity, wind_degree, wind_speed, dew_point, uvi, clouds};

}

async function Daily_Weather(response){

    const data = await response
    const timezone_offset = data.timezone_offset;
    const toffset = new Date().getTimezoneOffset()* 60;
    const zone_difference = timezone_offset + toffset;
    const forecasts = [];

    data.daily.forEach((element) => {
        forecasts.push({
            dt : new Date((element.dt + zone_difference) * 1000).toISOString().split('T')[0],
            sunrise : new Date((element.sunrise + zone_difference) * 1000).toLocaleString("en-US"),
            sunset : new Date((element.sunset + zone_difference) * 1000).toLocaleString("en-US"),
            moonrise : new Date((element.moonrise + zone_difference) * 1000).toLocaleString("en-US"),
            moonset : new Date((element.moonset + zone_difference) * 1000).toLocaleString("en-US"),
            moon_phase : element.moon_phase,
            day_temp : element.temp.day,
            min_temp : element.temp.min,
            max_temp : element.temp.max,
            night_temp : element.temp.night,
            eve_temp : element.temp.eve,
            morn_temp : element.temp.morn,
            feels_like_day : element.feels_like.day,
            feels_like_night : element.feels_like.night,
            feels_like_eve : element.feels_like.eve,
            feels_like_morn : element.feels_like.morn,
            pressure : element.pressure,
            humidity : element.humidity,
            dew_point : element.dew_point,
            wind_speed : element.wind_speed,
            wind_gust : element.wind_gust,
            main_description : element.weather[0].main,
            second_description : element.weather[0].description,
            icon : element.weather[0].icon,
            clouds : element.clouds,
            pop : element.pop,
            uvi : element.uvi,
        });
    });

    return forecasts

}

async function Alerts_Weather(response){
    
    const data = await response
    const timezone_offset = data.timezone_offset;
    const toffset = new Date().getTimezoneOffset() * 60;
    const zone_difference = timezone_offset + toffset;

    let alerts_forecast = [];

    if(data.alerts){
        data.alerts.forEach((element)=>{
        alerts_forecast.push({
            sender_name: element.sender_name,
            event : element.event,
            start : new Date((element.start + zone_difference) * 1000).toLocaleString("en-US"),
            end: new Date((element.end + zone_difference) * 1000).toLocaleString("en-US"),
            description : element.description,
            tags : element.tags,
        })
    })
    }

    return alerts_forecast;
}


async function Hourly_Weather(response){
    const data = await response;
    const timezone_offset = data.timezone_offset;
    const toffset = new Date().getTimezoneOffset() * 60;
    const zone_difference = timezone_offset + toffset;

    const hourly_forecasts = []

    data.hourly.forEach((element)=>{
        hourly_forecasts.push({
            dt : new Date((element.dt + zone_difference) * 1000).toLocaleString("en-US"),
            temp : element.temp,
            feels_like : element.feels_like,
            pressure : element.pressure,
            humidity : element.humidity,
            dew_point : element.dew_point,
            uvi : element.uvi,
            clouds : element.clouds,
            visibility : element.visibility,
            wind_speed : element.wind_speed,
            wind_deg : element.wind_deg,
            wind_gust : element.wind_gust,
            main_description : element.weather[0].main,
            second_description : element.weather[0].description,
            icon : element.weather[0].icon,
            pop : element.pop
        });
    })

    return hourly_forecasts;
}
