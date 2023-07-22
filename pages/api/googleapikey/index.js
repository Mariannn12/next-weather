
export const config = {
    runtime: 'edge',
  };
export default async function handler(req,res){
    try{
        res.status(200).json({key: process.env.GOOGLE_API_KEY})

    }catch(error){
        res.status(501).json({message: error})
    }
}