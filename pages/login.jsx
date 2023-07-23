import React from 'react'
import {useSession, signIn, signOut} from 'next-auth/react'
import { useRouter} from 'next/router'


const Login= () =>{
    const {data:session} = useSession({required:true})
    
    if(session){
        
        return(
            
        <div>
            <p>Welcome, {session.user.email}</p>
            <button onClick={()=>signOut()}>Sign out</button>
        </div>
            
        )
    }else{
        return(
            <div>

                <p>You are not signed in.</p>
                <button onClick={()=>signIn()}>Log in</button>
            </div>
        )
    }
}

export default Login;