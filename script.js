const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
let currentWeatherItemEl = document.getElementById('current-weather-item');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const fundo = document.querySelector('.fundo')


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const API_KEY = '2915e8300d57a6f21a0ce2633e4f7011';


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const minutesWith0 = minutes < 10 ? '0'+minutes: minutes
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat <10 ? '0'+hoursIn12HrFormat: hoursIn12HrFormat) + ':' + minutesWith0+ ' '+`<span id="am-pm">${ampm}</span>
    </div>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' '+ months[month]

    if(hour > 6 && ampm =="PM"){
    fundo.style.backgroundImage = "url(https://images.unsplash.com/photo-1611416517780-eff3a13b0359?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1349&q=80)"
    }else {
        fundo.style.backgroundImage = "url(https://images.unsplash.com/photo-1654423625348-b031628eb38d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80);" 
    }



}, 1000);



function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success)

        let{latitude, longitude} =success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            
        console.log(data)
        showWeatherData(data);
        })
    })
}

getWeatherData()

function showWeatherData (data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    currentWeatherItemEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    
    `;
    

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="others">
                <div class="day">Monday</div>
                <div class="temp">Night - ${day.temp.night.toFixed()}&#176; C</div>
                <div class="temp">Day - ${day.temp.day.toFixed()}&#176; C</div>
            </div>     `
        }else{
            otherDayForcast += `<div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon"> 
            <div class="temp">Night - ${day.temp.night.toFixed()}&#176; C</div>
            <div class="temp">Day - ${day.temp.day.toFixed()}&#176; C</div>
        </div>`
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}