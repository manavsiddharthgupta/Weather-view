const leftbtn = document.querySelector(".left");
const rightbtn = document.querySelector(".right");
const allpopularCities = document.querySelector(".popular-card");

const allcards = document.querySelector(".overview-card");
const conversionTypes = document.querySelector(".cel-and-far");
leftbtn.onclick = ()=>{
    slide('left');
}
rightbtn.onclick = ()=>{
    slide('right')
}

function slide(btn){
    scrollAmount = 0;
    const settime = setInterval(function(){
        if (btn == 'left') {
            allpopularCities.scrollLeft -= 10;
        } else {
            allpopularCities.scrollLeft += 10;
        }
        scrollAmount += 10;
        if(scrollAmount >= 244){
            window.clearInterval(settime);
        }
    },25)
}

//
const container = document.querySelector(".container");
const temperature = document.querySelector(".temp");
const cityName = document.querySelector(".city-name");
const time = document.querySelector(".city-time");
const condition = document.querySelector(".condition p");
const icon = document.querySelector(".condition .icons");
const input = document.querySelector(".search-bar");



// 
const wind = document.querySelector(".wind .data");
const humidity = document.querySelector(".humidity .data");
const pressure  = document.querySelector(".pressure .data");
const dewPoints = document.querySelector(".something .data");
const unitCel = document.querySelector(".cel");
const unitfar = document.querySelector(".far");
const unit = document.querySelector(".cel-and-far");

const setTime = () =>{
    const currentTime = new Date();
    let hr = currentTime.getHours();
    hr = hr%12;
    let hrandmin = `${hr}:${currentTime.getMinutes()}`;
    time.textContent = hrandmin;
}
setTime();
setInterval(setTime,1000);

let weather = {
    apiKey : "899775a68a9f80c7844d1b62fd302bec"
}

let takingCity = ""; 
input.addEventListener('submit',(e)=>{
    e.preventDefault()
    let city = e.target.firstElementChild.value;
    takingCity = city;
    getLocation(city);
    e.target.firstElementChild.value = "";
})


function getLocation(city){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weather.apiKey}`).then((resp)=>{
        if(resp.ok){
            return resp.json();
        }
        
    }).then((resp)=>{
        console.log(resp);
        cityName.textContent = resp.name;
        if(unitCel.classList.contains("activeState")){
            getWeatherData(resp.coord.lat,resp.coord.lon,"metric","c","mt/s");
        } else {
            getWeatherData(resp.coord.lat,resp.coord.lon,"imperial","f"," m/h");
        }
        
    }).catch((err)=>{
        console.log("something got error",err);
    })
}

popularCities();
function popularCities(){
    let allpopularCities = ["Delhi", "Bangalore", "Mumbai", "Hyderabad"];
    let allPopularCitiesName = document.querySelector(".popular-card");
    allpopularCities.forEach((city)=>{
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weather.apiKey}`).then((response)=>{
            return response.json();
        }).then((response)=>{
            let temp = response.main.temp - 273;
            temp = temp.toFixed(2);
            const popularcity = document.createElement("div");
            popularcity.classList.add("popular-cities");
            const innerpopularcity = `<p class="popular-cities-name">${city}, India</p>
            <p class="popularCities-temp">${temp}&deg;C</p>`
            popularcity.innerHTML = innerpopularcity;
            allPopularCitiesName.append(popularcity);
        })
    })
}



setlocation();
function setlocation(){
    navigator.geolocation.getCurrentPosition((success)=>{
        let {latitude, longitude} = success.coords;
        fetch(`http://www.mapquestapi.com/geocoding/v1/reverse?key=DbPqL9bmEV3RMTMUj2fcpL3n33CtqrV3&location=${latitude},${longitude}&includeRoadMetadata=true&includeNearestIntersection=true`)
            .then((response) => response.json())
            .then((responseJson) => {
                cityName.textContent = responseJson.results[0].locations[0].adminArea5;
            });
            console.log(unitCel.classList);
            if(unitCel.classList.contains("activeState")){
                getWeatherData(latitude,longitude,"metric","c"," m/s");
            } else {
                getWeatherData(latitude,longitude,"imperial","f"," m/h");
            }

    })
}
function getWeatherData(latitude, longitude, units, unitdeg, unitspeed){
        
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=${units}&appid=${weather.apiKey}`).then((rep)=>{
            return rep.json();
        }).then((rep)=>{
            const weatherdata = rep;
            showweatherdata(weatherdata, unitdeg, unitspeed)
        }).catch(()=>{
            console.log("error")
        })
        
}

function showweatherdata(weatherdata, unitdeg, unitspeed){
    const {dew_point:dewPoint,feels_like:feelsLike,humidity:humidity_data,pressure:pressure_data,temp,weather:[{description:conditionData,icon:icondata}],wind_speed} = weatherdata.current
    temperature.innerHTML = `${parseInt(temp)}&deg${unitdeg}`;
    condition.textContent = conditionData;
    icon.src = "./icon/"+icondata+".png";
    container.style.backgroundImage = `url(./images/${icondata}.jpg)`;
    wind.textContent = wind_speed + unitspeed;
    humidity.textContent = humidity_data+"%";
    pressure.textContent = pressure_data+" mb";
    dewPoints.textContent = dewPoint;
    showoverviewData(weatherdata.daily);

}


function showoverviewData(data){
    
    while(allcards.firstChild) {
            allcards.removeChild(allcards.firstChild);
        }
    data.forEach(element => {
        var dayname = new Date(element.dt * 1000).toLocaleDateString("en", {
            weekday: "long",
        });
        // console.log(window.moment(element.dt*1000).format('ddd'));
        const outerDiv = document.createElement("div");
        const ovrcard = `<div class="day0 week">
        <p class="dayName">${dayname}</p>
        <div class="overview-overview">
            <img src="./icon/${element.weather[0].icon}.png" alt="">
            <div class="overview-temp">
                <p class="day-overview">${element.temp.day}&deg;</p>
                <p class="night-overview">${element.temp.night}&deg;</p>
            </div>
        </div>
        <div class="overview-wind ovr-wh">
            <p>WIND</p>
            <p class="data">${element.wind_speed}</p>
        </div>
        <div class="overview-humidity ovr-wh">
            <p>HUMIDITY</p>
            <p class="data">${element.humidity}%</p>
        </div>
       </div>`
       outerDiv.innerHTML = ovrcard;
       allcards.append(outerDiv);
    //    console.log(allcards);

    });
}


unit.addEventListener('click',(e)=>{
    if(e.target.classList.contains("cel")){
        unitfar.classList.remove("activeState");
        e.target.classList.add("activeState");
        if(takingCity == ""){
            setlocation();
        } else {
            getLocation(takingCity);
        }
        
    } else {
        unitCel.classList.remove("activeState");
        e.target.classList.add("activeState");
        if(takingCity == ""){
            setlocation();
        } else {
            getLocation(takingCity);
        }
        
    }

})





const leftbtnforovr = document.querySelector(".left-ovr");
const rightbtnforovr = document.querySelector(".right-ovr");
leftbtnforovr.onclick = ()=>{
    slideovr('leftovr');
}
rightbtnforovr.onclick = ()=>{
    slideovr('rightovr')
}

function slideovr(btn){
    scrollAmount = 0;
    const settimeovr = setInterval(function(){
        if (btn == 'leftovr') {
            allcards.scrollLeft -= 12;
        } else {
            allcards.scrollLeft += 12;
        }
        scrollAmount += 100;
        if(scrollAmount >= 2040){
            window.clearInterval(settimeovr);
        }
    },28)
}


