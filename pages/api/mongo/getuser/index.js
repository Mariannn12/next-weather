import {MongoClient} from 'mongodb';
export const config = {
    runtime: 'edge',
  };
export default async function handler(req,res){

    const uri = process.env.MONGO_STRCON
    const client = new MongoClient(uri)
    try{
        const {email} = req.query
        const database = client.db("Weather")
        const users = database.collection("Users")
        const cursor =  users.findOne({"email":email})
        res.status(200).send(await cursor)
    }catch(error){
        res.status(500).json({message : error})
    }finally{
        client.close()
    }
}