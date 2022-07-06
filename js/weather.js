const city = 'Dnipro';
const URL_API = `https://api.openweathermap.org/data/2.5/forecast?appid=302194042e30cf68ae215cbabca7559f&units=metric&q=`;
const IMG_PATH = 'https://openweathermap.org/img/wn/';
const URL_WEATHER = `https://api.openweathermap.org/data/2.5/weather?appid=302194042e30cf68ae215cbabca7559f&units=metric&q=`;
const now = new Date();
const year = now.getFullYear();
let month = now.getMonth()+1;
let day = now.getDate();
let dayOfWeek = now.getDay();
const date = document.querySelector("#date");
const time = document.querySelector("#time");
const main = document.getElementById('main');
const search = document.getElementById('search');
const formSearch = document.getElementById('form-search');
const weatherElTemp = document.getElementById('temperature');
const cityText = document.getElementById('city'); 
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind');
const description =  document.getElementById('description');
const temperature = document.getElementById('temperature');

const nameDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const nameDayShort = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];

const monthArr =[
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'November',
'December',
];

getDateNow();
//getWeather(URL_API);

function getDateNow(){

    if(now.getMinutes()<10){
    minutes = "0"+now.getMinutes();
    }else {
    minutes = now.getMinutes();
    }

time.innerHTML = now.getHours() + ":" + minutes;
date.innerHTML = nameDay[now.getDay()] +", "+ day +" "+ monthArr[now.getMonth()] +" "+ year;

   if(month<10) month = '0'+month;
   if(day<10) day = '0'+day;
}

async function getWeather(url){
    const res = await fetch(url);
    const data = await res.json();
    showWeather(data.list);
}

async function getWeatherForCity(url){
    const res = await fetch(url);
    const data = await res.json();
    showWeatherForCity(data);
}

function showWeatherForCity(weather){

description.innerHTML = weather.weather[0].description;
temperature.innerHTML = Math.round(weather.main.temp)+"°";
humidity.innerHTML = "Humidity: "+weather.main.humidity+"%";
windSpeed.innerHTML = "Wind: "+weather.wind.speed +" km/h";

    weatherElTemp.classList.add('temperature');
    weatherElTemp.innerHTML = `${Math.round(weather.main.temp)+"°"}
     <img class="temperature" src="${iconsForWeb(weather.weather[0].icon.substring(0,2)+'n')}" 
     alt="${weather.weather[0].icon}">
    `
   // weatherElTemp.appendChild(weatherElTemp);
}

function showWeather(weather){
    let str = "";
    let count = 0;
    let weatherForFiveDays = [];
    let dayOfWeekForArr = "";
  
    for(let i=0; i<weather.length; i++){
    str = weather[i].dt_txt;
    
    if(!str.includes(`${year}-${month}-${day}`)){
      if (str.includes('12:00:00')){
       console.log(dayOfWeek);
       console.log("количество+день "+(Number(dayOfWeek)+count)); 
            if(dayOfWeek === 6){
                dayOfWeek = 0;
                count = 0;
                dayOfWeekForArr = nameDayShort[0];   
                         
            }  else {
                count++;
            if((Number(dayOfWeek)+count)>6){
                count = 0;
                dayOfWeekForArr = nameDayShort[count];            
            } else{
                dayOfWeekForArr = nameDayShort[dayOfWeek+count];  
            }
                             
            }

        weatherForFiveDays.push({
            "dayOfWeek": dayOfWeekForArr,
            "date":weather[i].dt_txt,
            "temp":Math.round(weather[i].main.temp),
            "humidity":weather[i].main.humidity,
            "description":weather[i].weather[0].description,
            "icon": weather[i].weather[0].icon.substring(0,2)+'n',
            "wind":weather[i].wind.speed
        }); 
      }
    }   
}

main.innerHTML = '';
weatherForFiveDays.forEach((weather) =>{
    const{dayOfWeek,date,temp,humidity,description,icon,wind
    } = weather;
    const weatherEl = document.createElement('div');
    weatherEl.classList.add('weather-temperature');
    weatherEl.innerHTML = `
        <h2>${dayOfWeek}</h2>
        <img src="${iconsForWeb(icon)}" alt="${icon}">
        <h3>${temp}°</h3>
        <div class="overview">
        <h3>${getClassByOverview(dayOfWeek,date,temp,humidity,description,icon,wind)}</h3>
        </div>
        </div>
    `
    main.appendChild(weatherEl);
})
}

function getClassByOverview(dayOfWeek,date,temp,humidity,description,icon,wind){
return `<div class="test">
<h2>${dayOfWeek}</h2>
<img src="${iconsForWeb(icon)}" alt="${icon}">
</div><br>
<span>${temp}°</span><br>
${description}<br>
<span>Humidity:</span> ${humidity}%<br>
<span>Wind:</span> ${wind}km/h`;
}


function iconsForWeb(value){
    console.log(value);
if(value === "01n"){
    return "images/sunny.png"
}else if(value === "03n"){
    return "images/cloud.png";
}else if(value === "10n"){
    return "images/sun_with_raine.png";
}else if(value === "09n"){
    link = "images/raine.png";
}else if(value === "02n"){
    return "images/cloud_with_sun.png"  ;  
}else if(value === "04n"){
    return "images/cloud.png";
}else{
   return `http://openweathermap.org/img/wn/${value}@2x.png`;
}
}

formSearch.addEventListener('submit',(e)=> {
    e.preventDefault()

const searchCity = search.value;
if(searchCity && searchCity !== ''){
    cityText.innerHTML = searchCity;
    getWeatherForCity(URL_WEATHER+searchCity);
    getWeather(URL_API+searchCity);
    
    search.value = '';
} else{
    window.location.reload();
}
})