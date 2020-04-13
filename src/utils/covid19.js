const request = require('request');
const lookup = require('country-code-lookup');

const getCovid19realTimeData = ({place_type, country, state, district}, callback) => {
    let urlCountry = '';
    if(country === 'India')
        urlCountry = '_india';
    const url = `https://corona-virus-world-and-india-data.p.rapidapi.com/api${urlCountry}?rapidapi-key=3fe01a4eddmshd86611689f269c5p1a8ea9jsn12d48189f2f3`;

    request({url, json: true}, (error, response)=>{
        if(error){
            callback('Unable toconnect to covid19 service', undefined);
        } else if(response.message)
        {
            callback('Unable to find location', undefined);
        }else{
            let countryData = null, stateData = null, districtData = null;
            if(place_type == 'neighborhood'){
                callback('COVID Data : Not Available For Continents!!!', undefined);
            }
            else{
                if(country === 'India'){
                    const covidIndiaData = response.body;
                    if(country)
                        countryData = covidIndiaData.total_values;
                    if(state)
                        stateData = covidIndiaData.state_wise[state];
                    if(district && stateData)
                        districtData = stateData.district[district];
                }else{
                    const covidCountryWiseData = response.body.countries_stat;
                    const countryCode = lookup.byCountry(country);
                
                    countryData = covidCountryWiseData.find((country_data) => {
                        return ((country_data.country_name.toLowerCase() == country.toLowerCase())||
                                (country_data.country_name.toLowerCase() == countryCode.iso2.toLowerCase()) ||
                                (country_data.country_name.toLowerCase() == countryCode.iso3.toLowerCase()));
                    })
                }
                
                callback(undefined, {
                    district: districtData,
                    state: stateData,
                    country: countryData
                })
                    
            }
        }
    })
}

module.exports = getCovid19realTimeData;