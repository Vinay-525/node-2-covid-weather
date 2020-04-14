const express = require('express');
const path = require('path');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forcast = require('./utils/forcast');
const covid19Data = require('./utils/covid19');

const app = express();
const port = process.env.PORT || 3000;

// Define path for Express config
const publicDirectoryPath = path.join(__dirname, '..', 'public');
const viewsDirectoryPath = path.join(__dirname, '..', 'templates', 'views');
const partialsDirectoryPath = path.join(__dirname, '..', 'templates', 'partials');

// Setup handlebars view engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsDirectoryPath);
hbs.registerPartials(partialsDirectoryPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/', (req,res) => {
    res.render('index', {
        title: 'Weather | COVID 19',
        name: 'Vinay Bansal'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Vinay Bansal'
    });
} )


app.get('/help', (req, res) => {
    // res.sendFile(path.join(publicDirectoryPath, 'help.html' ));
    res.render('help', {
        title: 'Help',
        name: 'Vinay Bansal'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if(!address){
        return res.send({
            error: "You must provide an address"
        })
    }

    geocode(address, (error, data) => {
        if(error){
            return res.send({error});
        } else{
            const outJSON = {};
            outJSON.address = address;
            outJSON.location = data.place_name;
            covid19Data(data, (error, response) => {
                if(error)
                    return res.send({error});
                else{
                    outJSON.covid = response;
                    forcast(data.lattitude, data.longitude, (error, data) => {
                        if(error){
                            outJSON.error_covid = error;
                        } else{
                            outJSON.forcast = `${data.weather_descriptions} .It is currently ${data.temperature} degree Celsius. It feels like ${data.apparentTemperature} degree Celsius. The
                            current humidity is ${data.humidity} %`;
                        }
                        return res.send(outJSON);
                    })
                }
            })
        }
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help Page Not Found',
        name: 'Vinay Bansal'
    })
})

app.get('*', (req,res) => {

    res.render('404', {
        title: '404',
        errorMessage: 'Page Not Found',
        name: 'Vinay Bansal'
    })
})

app.listen(port, ()=>{
    console.log('Server is up on PORT 3000!!');
})