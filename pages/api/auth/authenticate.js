import {getSession} from 'next-auth/react';


export default async function handler(req,res){

    if(session in req.cookies){
        res.statu
    }

    const session = await getSession({req});
    res.status(200).json({session});

}