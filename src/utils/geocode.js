const request = require('request');

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoidmluYXk1MjUiLCJhIjoiY2s4dm9xNDk2MGpyZTNybzc0ZDhyaHRqNCJ9.a6B7TwfieZnmccAe7OUoAQ`;

    request({url, json: true}, (error, {body})=>{
        if(error){
            callback('Unable toconnect to geocoding service', undefined);
        } else if(body.features.length == 0)
        {
            callback('Unable to find location', undefined);
        }else{
            const location = body.features[0];
            let country = null, state = null, district = null;
            if(location.place_type[0] == 'country'){
                country = location.text;
            }else if(location.place_type[0] == 'region' || location.context.length == 1){
                country = location.context[location.context.length -1].text;
                state = location.text;
            }else if(location.place_type[0] == 'district' || location.context.length == 2){
                country = location.context[location.context.length -1].text;
                state = location.context[location.context.length -2].text;
                district = location.text;
            }else if(location.place_type[0] == 'poi' || location.place_type[0] == 'place' || location.place_type[0] == 'locality' || location.context.length >= 3){
                country = location.context[location.context.length -1].text;
                state = location.context[location.context.length -2].text;
                district = location.context[location.context.length -3].text;
            }
            callback(undefined, {
                lattitude: location.center[1],
                longitude: location.center[0],
                place_name: location.place_name,
                district: district,
                state: state,
                country: country,
                place_type: location.place_type[0]
            })
        }
    })
}

module.exports = geocode;