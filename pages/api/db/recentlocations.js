
async function joinWeatherLocation(id,lat,lon,location,place_id){

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_OWM_KEY}&units=metric`)
    const data= await res.json();
    const main_body = data.main;
    const feels_like = main_body.feels_like;
    const main_description = data.weather[0].main
    const icon = data.weather[0].icon;
    const place_timezone = data.timezone;
    const today = new Date();
    const toffset = today.getTimezoneOffset() * 60;
    const zone_difference = toffset + place_timezone;
    const dt = new Date((data.dt +zone_difference) * 1000).toLocaleString("en-US")
    
    return {id,dt, location, feels_like,place_id,main_description,icon};

}

export default async function getRecentLocations (req,res){
    try{

        const {email} = req.query
        var result = []

        const response = await (await fetch(`http://localhost:3000/api/mongo/getuser?email=${email}`)).json()

        const recentplaces = response.recentplaces

        recentplaces.forEach(async (element) => {
            result.push(joinWeatherLocation(element.id,element.latitude, element.longitude,element.name,element.place_id))

        });

        var promises = await Promise.all(result)
        res.status(200).json(promises)

    }catch(error){
        res.status(500).send({message: 'error', data : error.message})
    }
}