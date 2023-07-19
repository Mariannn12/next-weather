import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Delete } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import _fetch from 'isomorphic-fetch';


export default function UserRecentLocation({userSession,locations}){

    const [internalLocations, setInternalLocations] = React.useState(locations)
    console.log(internalLocations)
    return(
        <div className='card-container' style={{display : 'flex', flexWrap : 'wrap', padding:30}}>

            {internalLocations.length > 0 ? (
                internalLocations.map((element,idx)=> (
                    <Card sx={{minWidth: 150, margin : 2}} align="center" key={idx}>
                    <CardContent>
                    <Tooltip title="Delete"><IconButton onClick={async ()=>{await fetch('/api/mongo/deleteuserlocation', {method:"POST", headers:{"Content-Type" : "application/json"},body: JSON.stringify({email: userSession.user.email, place_id : element.place_id})}); setInternalLocations(internalLocations.filter((example)=> example.place_id !== element.place_id))}}><Delete/></IconButton></Tooltip>
                    </CardContent>
              
                    <CardActionArea href={`/search/${element.place_id}`}>
                
                        <CardMedia sx={{height: 100,width:100}} image={`https://openweathermap.org/img/wn/${element.icon}@2x.png`}/>
                        <CardContent className={element.place_id}>
                  
                            <Typography>Last update: {element.dt}</Typography>
                            <Typography variant="h6">{element.location}</Typography>
                            <Typography>{element.feels_like}°C</Typography>
                            <Typography>{element.main_description}</Typography>
                        </CardContent>

                    </CardActionArea>
              
                </Card>
                ))

            ) : (

                <Typography align="center" component="h5">No recent locations, have a search!</Typography>

            )}

        </div>
    )
}