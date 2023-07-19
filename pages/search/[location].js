import React from "react";
import {useSession,getSession,signOut} from 'next-auth/react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Typography from "@mui/material/Typography";
import FormControl from '@mui/material/FormControl'
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal"
import SearchAnyLocation from "@/src/Components/Search";
import { useLoadScript, GoogleMap ,MarkerF } from "@react-google-maps/api";
import Select from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import MenuItem from '@mui/material/MenuItem';
import {InputLabel} from "@mui/material";
import ResponsiveAppBar from "@/src/Components/NavBar";


WeatherLocation.getInitialProps = async(ctx)=>{
    
    var place_id= ctx.query.location
    const coordinates = await (await fetch(`http://localhost:3000/api/googlegeo?place_id=${place_id}`)).json()
    const single = await (await fetch(`http://localhost:3000/api/weather?lat=${coordinates.lat}&lon=${coordinates.lng}`)).json()//OWM_ONE_CALL_API(coordinates.lat, coordinates.lng)  
    const googlemapskey = await (await fetch(`http://localhost:3000/api/googleapikey`)).json()
    
    return {props: {currentweather:single.current, onecallcurrent:single.current, dailyforecast:single.daily, alerts:single.alerts, hourlyforecasts:single.hourly, location_info:coordinates, placeid : place_id, session:await getSession(ctx), googlemapskey : googlemapskey},};

}

const DefaultMediaCard = ({props}) => {
   
    return (
        
        <div style={{
            display : 'flex',
            alignItems : 'center',
            justifyContent : 'center',
            padding : 30
        }}>

            <Card sx={{maxWidth : 400}} align="center" gutterbottom="true">

                <CardMedia sx={{height: 200,width: 200}} image={`https://openweathermap.org/img/wn/${props.currentweather.icon}@4x.png`} title="location details" />
                <CardMedia sx={{width:64, height:64}} image={`https://flagsapi.com/${props.currentweather.country}/shiny/64.png`} />
                <CardContent>
                    <Typography gutterbottom="true" variant="h5" component="div" align="center">Last update(local time): {props.currentweather.dt}</Typography>
                    <Typography gutterbottom="true" variant="h5" component="div" align="center">{props.location_info.formatted_address}</Typography>
                    <Typography color="text.secondary"gutterbottom="true" variant="h4" align="center">{props.currentweather.temp}°C</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h4" align="center">{props.currentweather.main_description}</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">{props.currentweather.second_description}</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Feels like: {props.currentweather.feels_like}°C</Typography>
                    <Typography color="text.secondary" gutterbottom variant="h5" align="center">Minimum temperature : {props.currentweather.min_temp}°C</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Maximum temperature : {props.currentweather.max_temp}°C</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Pressure: {props.currentweather.pressure} hPa</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Humidity: {props.currentweather.humidity}%</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Wind speed: {props.currentweather.wind_speed}m/s</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">UVI: {props.onecallcurrent.uvi}</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Clouds: {props.onecallcurrent.clouds}%</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Dew point: {props.onecallcurrent.dew_point}</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Wind degree: {props.onecallcurrent.wind_degree}°</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Sunrise:  {props.currentweather.sunrise}</Typography>
                    <Typography color="text.secondary" gutterbottom="true" variant="h5" align="center">Sunset:  {props.currentweather.sunset}</Typography>
                </CardContent>
            </Card>
        </div>
    )
}       


function ForecastDaily({data,modalopen,index}){

    return (
    <>
        {data.slice(8*index-8, 8*index).map((forecast,idx) => (
            <CardActionArea onClick={() => modalopen(forecast)} key={idx}>

            <Card sx={{maxWidth : 400, margin: 2}} align="center">
                <CardMedia sx={{height: 100, width:100}} image={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}/>
                <CardContent>
                    <Typography gutterbottom="true" variant="h5" align="center">{forecast.dt}</Typography>
                    <Typography gutterbottom="true" color="text.secondary" variant="h6" align="center">{forecast.main_description}</Typography>
                    <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">{(Math.round(forecast.max_temp+forecast.min_temp)/2).toFixed(2)}°C</Typography>
                </CardContent>                       
            </Card>
            </CardActionArea>
        ))}
    </>)
}


function ForecastHourly({data, modalopen,index}){

    return (<>
        {data.slice(8*index-8, 8*index).map((forecast,idx) => (
        <CardActionArea onClick={()=>modalopen(forecast)} key={idx}>
            <Card sx={{maxWidth : 400, margin : 2}} align="center">
        
                <CardMedia sx={{height: 100,width: 100}} image={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}/>
                <CardContent>
                    <Typography gutterbottom="true" variant="h5" align="center">{forecast.dt}</Typography>
                    <Typography gutterbottom="true" color="text.secondary" variant="h6" align="center">{forecast.main_description}</Typography>
                    <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">{forecast.temp}°C</Typography>
                </CardContent>
            </Card>

        </CardActionArea>
        
    ))}</>)
}

function ForecastAlerts({data}){
    return data.length ? (<>

        {data.map((alert,idx) => (
            <Paper sx={{p:2,margin:'auto',maxWidth: 500,flexGrow:1,backgroundColor:(theme)=>theme.palette.mode === 'dark' ? '#1A2027' : '#fff',}} key={idx}>

                <Grid container spacing={2}>
                    <Grid item>
                        <CardMedia sx={{height:100, width: 100}} image/>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>

                            <Grid item xs>
                                <div>
                                    <Typography gutterbottom="true" variant="subtitle1" component="div">{alert.sender_name}</Typography>
                                    <Typography variant="body2" gutterbottom="true">{alert.event}</Typography>
                                    <Typography variant="body2" gutterbottom="true">Start: {alert.start}</Typography>
                                    <Typography variant="body2" gutterbottom="true">End: {alert.end}</Typography>
                                    <Typography variant="body2" color="text.secondary">{alert.description}</Typography>
                                </div>
                                
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>

            </Paper>
        ))}
        </>
    ) : (<h1>There are no weather alerts</h1>)
}

function reducer(state, action){
    
        switch(action.type){
            case 'Daily':
                return {forecast: <ForecastDaily/>}
            case 'Hourly' :
                return {forecast: <ForecastHourly/>}
            case 'Alerts' :
            return {forecast : <ForecastAlerts/>}
        default:
            throw new Error();
        }
        
}


function DefaultTabs({hourlyforecasts, dailyforecasts, alerts}){

    const [state,dispatch] = React.useReducer(reducer, {forecast: <ForecastHourly/>,data:hourlyforecasts})
    const ReducedForecast = state.forecast.type;
    const [modalContent, setModalContent] = React.useState({});
    const [open,setOpen] = React.useState(false);
    const handleOpen = ()=> setOpen(true);
    const handleClose = ()=>setOpen(false);
    const [results,setResults] = React.useState(hourlyforecasts);
    const initialState = results
    const [index, setIndex] = React.useState(1);
    const [display, setDisplay] = React.useState('Hourly');

    return (

        <>

            <div style={{display:'flex', alignItems : 'center', justifyContent:'center'}}>
                <FormControl sx={{m:1, minWidth: 120}} size="small">
                    <InputLabel id="demo-small">Forecast</InputLabel>
                    <Select labelId="demo" id="demo-select" value={display} label="forecast" onChange={(e)=> {setDisplay(e.target.value); console.log(display)}}>
                        <MenuItem value="Hourly" onClick={()=>{setResults(hourlyforecasts);setIndex(1);dispatch({type:'Hourly'});console.log(state.data)}}>Hourly</MenuItem>    
                        <MenuItem value="Daily" onClick={()=>{setResults(dailyforecasts);setIndex(1);dispatch({type: 'Daily'});console.log(state.data)}}>Daily</MenuItem>
                        <MenuItem value="Alerts" onClick={()=>{setResults(alerts); setIndex(1);dispatch({type: 'Alerts'})}}>Alerts</MenuItem>
                    </Select> 
                </FormControl>
            </div>

            
            <div style={{display :'flex', alignItems: 'center', justifyContent: 'center'}}>

                <Modal open={open} onClose={handleClose}>
                    <div style={{display: 'flex', alignItems :'center', justifyContent : 'center', padding:30}}>
                        <Card sx={{maxWidth : 400, margin: 2}} align='center'>
                            <CardMedia sx={{height : 100, width: 100}} image={`https://openweathermap.org/img/wn/${modalContent.icon}@2x.png`}/>
                            <CardContent>

                                {display === 'Hourly' ? 
                                    (<>
                                        <Typography gutterbottom="true" variant="h5" align="center">Time: {modalContent.dt}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h6" align="center">{modalContent.temp}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">{modalContent.main_description}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Feels like: {modalContent.feels_like}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">{modalContent.second_description}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Humidity: {modalContent.humidity}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Pressure: {modalContent.pressure}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Dew point: {modalContent.dew_point}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Uvi :{modalContent.uvi}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Wind speed :{modalContent.wind_speed}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Wind degree :{modalContent.wind_degree}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Clouds :{modalContent.clouds}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Visibility :{modalContent.visibility}</Typography>
                            
                                    </>)
                                    :(<>
                                        <Typography gutterbottom="true" variant="h5" align="center">Time: {modalContent.dt}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">{modalContent.main_description}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">{modalContent.second_description}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Max temp: {modalContent.max_temp}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Min temp: {modalContent.min_temp}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Day temp: {modalContent.day_temp}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Night temp: {modalContent.night_temp}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Evening temp: {modalContent.eve_temp}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Morning temp: {modalContent.morn_temp}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Day felt temp: {modalContent.feels_like_day}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Night felt temp: {modalContent.feels_like_night}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Evening felt temp: {modalContent.feels_like_eve}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Morning felt temp: {modalContent.feels_like_morn}°C</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Pressure: {modalContent.pressure}hPa</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Humidity: {modalContent.humidity}%</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Dew point: {modalContent.dew_point}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Wind speed: {modalContent.wind_speed}m/s</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Uvi level: {modalContent.uvi}</Typography>
                                        <Typography gutterbottom="true" color="text.secondary" variant="h5" align="center">Cloud percentage: {modalContent.clouds}%</Typography>
                                      </>
                                    )
                                }

                            </CardContent>
                        </Card>
                    </div>
                </Modal>
                
                <ReducedForecast data={results} modalopen={(forecast)=>{setModalContent(forecast); setOpen(true)}} index={index}/>

            </div>

            {results.length > 8 ? 
                (<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                    <Pagination count={results.length / 8} size="large" onChange={(event,value)=>{setIndex(value);}}/>

                </div>):
                
                (<></>)
            }
        </>
    );
}

function loadScript(src, position, id){

    if(!position){
      return;
    }
  
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
  
}

export default function WeatherLocation({props}){

    const {data:session,status} = useSession({required : true,})
    
    const loaded = React.useRef(false);

    
    React.useEffect(()=>{
        

        ;(async function (){

            const session = await getSession()

            try{
             
            await fetch(`http://localhost:3000/api/mongo/postuserlocation?email=${session.user.email}`,{

                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    name : props.location_info.formatted_address,
                    place_id : props.placeid,
                    latitude : props.location_info.lat,
                    longitude : props.location_info.lng
                })

            })

            loaded.current = true

            }catch(error){

                console.log(error)
            }
        
        })()
        
    },[loaded])

    const libraries = React.useMemo(()=> ['places'], []);
    const mapCenter = React.useMemo(()=> ({lat : props.location_info.lat, lng: props.location_info.lng}),[])
    
    const {isLoaded , loadError} = useLoadScript({
        googleMapsApiKey : props.googlemapskey.key,
        libraries : libraries,
        id : 'google-maps'
    })
    return(
        <>
            {session && (
                <>
                    <ResponsiveAppBar session={session} logOut={signOut}/>
                    
                    <SearchAnyLocation/>

                    <div style={{display: 'flex', alignItems:'center', justifyContent: 'center'}}>
                
                        <DefaultMediaCard props={props}/>

                        {isLoaded && (

                        <>

                            <GoogleMap zoom={14} options={()=>({disableDefaultUI : true, clickableIcons: true, scrollwheel: false,})} center={mapCenter} mapTypeId={google.maps.MapTypeId.ROADMAP} mapContainerStyle={{width : '500px', height: '500px'}}>
                                <MarkerF position={mapCenter}/>
                            </GoogleMap>
                        </>
                    )}
                    </div>
            
                    <DefaultTabs hourlyforecasts={props.hourlyforecasts} dailyforecasts={props.dailyforecast} alerts={props.alerts}/>
                </>
            )}
        </>
    )
}