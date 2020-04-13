console.log('Client Side JS is loaded.');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');
const covidElement = document.getElementById('covid');

messageOne.textContent = '';
messageTwo.textContent = '';
covidElement.style.display = 'none';

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = search.value;
    messageOne.textContent = 'Fetching Data is in progress ...';
    fetch(`/weather?address=${location}`).then((response) => {
        response.json().then((data)=>{
            covidElement.style.display = 'none';
            if(data.error){
                console.log(data.error);
                messageOne.textContent = data.error;
            }else{
                const covidDistrict = document.getElementById('district');
                const covidState = document.getElementById('state');
                const covidCountry = document.getElementById('country');
                covidDistrict.style.display = 'block';
                covidState.style.display = 'block';
                covidCountry.style.display = 'block';

                // console.log(data);
                covidElement.style.display = 'block';
                if(!data.covid.district)
                    covidDistrict.style.display = 'none'
                if(!data.covid.state)
                    covidState.style.display = 'none';

                fillContent(covidDistrict.children[0].children, data.covid.district);
                fillContent(covidState.children[0].children, data.covid.state);
                fillContent(covidCountry.children[0].children, data.covid.country);
                
  
                messageOne.textContent = data.location;
                messageTwo.textContent = data.forcast;
            }
        })
    })
})

function fillContent(e, data){
    if(data == null) data = {};
    console.log(data);
    e[0].textContent = 'Confirmed Cases : ' + ((data.confirmed || data.cases) || 0);
    e[1].textContent = 'Recovered Cases : ' + ((data.recovered || data.total_recovered) || 0);
    e[2].textContent = 'Death Cases     : ' + (data.deaths || 0);
}