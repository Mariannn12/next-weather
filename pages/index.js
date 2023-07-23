import * as React from 'react';
import Typography from '@mui/material/Typography';
import ResponsiveAppBar from '@/src/Components/NavBar';
import {useSession,signIn,signOut,getSession} from 'next-auth/react'
import {getServerSession} from 'next-auth/next'

import SearchAnyLocation from '@/src/Components/Search';
import { Delete } from '@mui/icons-material';
import UserRecentLocation from '@/src/Components/RecentUserLocations';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import _fetch from 'isomorphic-fetch';
import { authOptions } from './api/auth/[...nextauth]';


export async function getServerSideProps(ctx){

  //fetch('http://localhost:3000/api/auth/authenticate').then((response)=> console.log("i got the response from api directory:", response))


  //const session = await (await fetch('http://localhost:3000/api/auth/authenticate')).json()


  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  console.log(session)

  if(!session){
    return{
      redirect : {
        destination : '/login',
        permanent: false,
      },
    }
  }


  return{
    props:{
      userSession : session,
      userRecentLoc : await (await fetch(`http://localhost:3000/api/db/recentlocations?email=${session.user.email}`)).json(),
      googlekey : await(await fetch(`http://localhost:3000/api/googleapikey`)).json()
    }
  }
}

export const Recent = ({session,recentLocations}) =>{
  
  //const [locations, setLocations] = React.useState([]);
  //const [usersession, setUsersession] = React.useState({});

  React.useEffect(()=>{

    ;(async()=>{

      await fetch('http://localhost:3000/api/mongo/postuser',{
        method : 'POST',
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          name : session.user.name,
          email : session.user.email,
          created_at : new Date().toLocaleString(),
          recentplaces : []
        })
      })

      //setLocations(await (await fetch(`http://localhost:3000/api/db/recentlocations?email=${session.user.email}`)).json()) 
      console.log(locations)

    })()
    
  },[])

  return(

    <div className='card-container' style={{display : 'flex', flexWrap : 'wrap', padding:30}}>

      {recentLocations.length && recentLocations.map((element,idx)=>(
            <Card sx={{minWidth: 150, margin : 2}} align="center" key={idx}>
              <CardContent>
                <Tooltip title="Delete"><IconButton onClick={async ()=>{await fetch('/api/mongo/deleteuserlocation', {method:"POST", headers:{"Content-Type" : "application/json"},body: JSON.stringify({email: usersession.user.email, place_id : element.place_id})}); setLocations(locations.filter((place) => place.place_id !== element.place_id))}}><Delete/></IconButton></Tooltip>
              </CardContent>
              
              <CardActionArea href={`/search/${element.place_id}`} >
                
                <CardMedia sx={{height: 100,width:100}} image={`https://openweathermap.org/img/wn/${element.icon}@2x.png`}/>
                <CardContent className={element.place_id}>
                  
                  <Typography>Last update(place local time): {element.dt}</Typography>
                  <Typography variant="h6">{element.location}</Typography>
                  <Typography>{element.feels_like}°C</Typography>
                  <Typography>{element.main_description}</Typography>
                </CardContent>
              </CardActionArea>
              
            </Card>
      ))}
  
    </div>
  )
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

export default function SearchPlaces({userRecentLoc,userSession,googlekey}) {

  const {data:session} = useSession({required : true,})
  const [locations, setLocations] = React.useState(userRecentLoc)
  const [usersession, setUsersession] = React.useState({});
  const [userDetails, setUserDetails] = React.useState({});
  const loaded = React.useRef(false)

  console.log(userSession)

  if(typeof window !== 'undefined' && !loaded.current){
    if(!document.querySelector('#google-maps')){
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${googlekey.key}&libraries=places`,
        document.querySelector('head'),
        'google-maps',
      )
    }
    loaded.current = true
  }

  React.useEffect(()=>{

    ;(async function(){
      
      await fetch('http://localhost:3000/api/mongo/postuser', {

        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },

        body : JSON.stringify({
          name : userSession.user.name,
          email : userSession.user.email,
          created_at : new Date().toLocaleString(),
          recentplaces : []
        })

      })

      /*
      setLocations(await (await fetch(`http://localhost:3000/api/db/recentlocations?email=${userSession.user.email}`)).json())
      console.log(locations)
      */
      
    })()

  },[])

  if(userSession){

    return (
      <>
        <ResponsiveAppBar logOut={signOut} session={userSession}/>
        <SearchAnyLocation/>
        <UserRecentLocation userSession={userSession} locations={userRecentLoc}/>
      </>
    );
          
  }else{

    return(
      <div>
        <p>You are not signed in.</p>
        <button onClick={()=>signIn()}></button>
      </div>
    )

  }
}