export const config = {
    runtime: 'edge',
  };

export default async function handler(req,res){

    const {place_id} = req.query;

    try{

        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${process.env.NEXT_GOOGLE_API_KEY}`)
        const data = await response.json();
        const country = (data.results[0].address_components).filter(object => object.types[0] === "country")[0].short_name
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;
        const formatted_address = data.results[0].formatted_address;
        const addresses = []

        data.results[0].address_components.forEach((addr_component) => {
            addresses.push(addr_component.long_name)
        });

        res.status(200).send({country,formatted_address,lat,lng,addresses})

    }catch(error){

        res.status(500).send({message : error})

    }

}