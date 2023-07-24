import * as React from 'react';

import {useSession,signIn,signOut,getSession} from 'next-auth/react'
import {getServerSession} from 'next-auth/next'
import SearchAnyLocation from '@/src/Components/Search';

import UserRecentLocation from '@/src/Components/RecentUserLocations';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import _fetch from 'isomorphic-fetch';
import { authOptions } from './api/auth/[...nextauth]';
import Login from './login'



export async function getServerSideProps(ctx){


  
  const session = await getSession(ctx)
  console.log(session)

  if(!session){
    return{
      redirect : {
        destination : '/login',
      },
    }
  }

 
  return{
    props:{
      userSession : session,
      
  }

}
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

export default function SearchPlaces(/*{userSession,googlekey}*/){

  /*

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

      
    })()

  },[])
  */
  return (
    <>

    
     
        
    </>
  );
}