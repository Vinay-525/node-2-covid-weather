const request = require('request');

const forcast = (lattitude, longitude , callback) => {
    const url = `http://api.weatherstack.com/current?access_key=71ea1850f696571bc7cc3deeea60cfcb&query=${lattitude},${longitude}&units=m`;

    request({url, json: true}, (error, {body})=>{
        if (error){
            callback('Unable to connect to weather service!!', undefined);
        } else if(body.error){
            callback('Unable to find location . Try Another Search !!', undefined);
        } else{
            const data = body.current;
            callback(undefined, {
                temperature: data.temperature,
                apparentTemperature: data.feelslike,
                weather_descriptions: data.weather_descriptions[0]
            });
        }
    })
}

module.exports = forcast;