import {MongoClient} from 'mongodb'


export default async function handler(req,res){
    const uri = process.env.MONGO_STRCON
    const client = new MongoClient(uri)

    try{
        const {email} = req.query
        const data = req.body

        const database = client.db("Weather")
        const users = database.collection("Users")
        const result = await users.updateOne({"email":email},{$addToSet:{"recentplaces" : data}})
        
        res.status(201).send({message : result})
        
    }catch(error){
        res.status(500).send({message : error})
    }finally{
        client.close()
    }

}