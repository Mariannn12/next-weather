import { MongoClient } from "mongodb"

export const config = {
    runtime: 'edge',
  };
export default async function handler(req,res){
    const uri = process.env.MONGO_STRCON
    const client = new MongoClient(uri)
    
    try{
        const {place_id, email} = req.body

        const database = client.db("Weather")
        const users = database.collection("Users")
        const result = await users.updateOne({"email" : email}, {$pull :{"recentplaces" : {"place_id" : {$eq : place_id}}}})

        res.status(201).json(result)
    }catch(error){
        res.status(500).json({message : error})
    }



}