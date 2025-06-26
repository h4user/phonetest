let td_wrap = document.getElementById("td_wrap");
let weekdays = document.getElementById("weekdays");
let state = [];
let UV_index = document.getElementById("UV_index");
let wind_status = document.getElementById("wind_status");
let sunrise_sunset = document.getElementById("sunrise_sunset");
let humidity = document.getElementById("humidity");
let visibility = document.getElementById("visibility");
let pressure = document.getElementById("pressure");
let search_bar = document.getElementById("search_bar");

function getLocation() {
   console.log(document.getElementById("search_bar").value);
   if (document.getElementById("search_bar").value == "") {
      return "Kaharlyk";
   } else {
      return search_bar.value;
   }
}
function weather_search(){
	fetch(`https://api.weatherapi.com/v1/forecast.json?key=5201affb726d495a85e161806252006&q=${getLocation()}&days=8&aqi=no&alerts=no`)
	.then(async function(respons){
		if(respons.status == 200) {
		let data = await respons.json()
		state = data;
		console.log(data);
		createToday(data);
      drawWeekDays(data);
		getStats(data);
	}
	else{
		alert(respons.status);
	}
	})
.catch(function(error){
	alert(error);
})
}
weather_search();

function createToday(data){
   td_wrap.innerHTML = ``
	let date = data.location.localtime.split(" ");
	let time = date[1];
	td_wrap.innerHTML += `<img src="http:${data.current.condition.icon}">
	 <h1>${data.current.temp_c}°C</h1>
	 <p><b>${getCurrentDayName(data)},</b> <span style="color: #a6a6a6">${time}</p><br><hr><br>
	 <p>${getWeatherText(data)}</p>
	 <p><i class="fa-solid fa-droplet"></i>    <b>Rain - ${data.current.precip_in}%</b></p><br>
    <p style="margin-right: 15%; margin-top: 4%; font-size: 25px; font-weight: bold; text-align: center;">${getLocation()}</p>`

}

function drawWeekDays(data){
   weekdays.innerHTML = ``;
	data.forecast.forecastday.forEach(e => {
      if(e == data.forecast.forecastday[0]) {
         return;
      }
      let div = document.createElement("div");
      div.classList.add("weekdays_divs");
		div.innerHTML += `<h4>${ getNextDayName(e.date)}</h5>
      <img src="http:${e.day.condition.icon}" width="62px">
      <h5>${e.day.avgtemp_c}° / <span style="color: #999999">${e.day.mintemp_c}°</h5>`;
      weekdays.append(div);
	})
}

function getStats(data) {
  let uv = Math.round(data.current.uv);
  UV_index.innerHTML = `
    <p style="color: #999999; font-size: 15.4px;">UV Index</p>
    <p style="font-size: 45px; text-align: center">${uv}</p>
    <p style="font-size: 21px; text-align: center">${getUVText(data)}</p>
    <input type="range" min="0" max="11" value="${uv}" disabled class="uv-range">
  `;
  wind_status.innerHTML = `
    <p style="color: #999999; font-size: 15.4px;">Wind Status</p>
    <p style="font-size: 45px; text-align: center; margin-top: 17px">${data.current.wind_kph} <case style="font-size: 27px;">km/h</p>
    <p style="font-size: 16px; margin-left: 5px; margin-top: 12px; font-weight: bold; text-align: center;"><i class="fa-solid fa-compass"></i>   ${data.current.wind_dir
}</p>
    `
    sunrise_sunset.innerHTML = `
    <p style="color: #999999; font-size: 15.4px;">Sunrsie & Sunset</p>
    <p style="margin-left: 5%; margin-top: 6.5%; font-weight: bold; font-size: 20px; text-align: center;"><i class="fa fa-arrow-circle-up" aria-hidden="true"></i>  ${data.forecast.forecastday[0].astro.sunrise}</p><br>
    <p style="margin-left: 5%; font-weight: bold; font-size: 20px; text-align: center;"><i class="fa fa-arrow-circle-down" aria-hidden="true"></i>  ${data.forecast.forecastday[0].astro.sunset}</p>
    `
   humidity.innerHTML = `
    <p style="color: #999999; font-size: 15.4px;">Humidity</p>
    <p style="font-size: 43px; text-align: center; margin-top: 17px">${data.current.humidity}%</p>
    <p style="font-size: 16px; margin-left: 5px; margin-top: 12px; font-weight: bold; text-align: center;">${getHumidityText(data)}</p>
   `
   visibility.innerHTML = `
    <p style="color: #999999; font-size: 15.4px;">Visibility</p>
   <p style="font-size: 45px; text-align: center; margin-top: 17px">${data.current.vis_km} <case style="font-size: 27px;">km</p>
    <p style="font-size: 16px; margin-left: 5px; margin-top: 12px; font-weight: bold; text-align: center;">${getVisibilityText(data)}</p>
   `
    pressure.innerHTML = `
    <p style="color: #999999; font-size: 15.4px;">Pressure</p>
   <p style="font-size: 45px; text-align: center; margin-top: 17px">${data.current.pressure_mb} <case style="font-size: 27px;">mb</p>
    <p style="font-size: 16px; margin-left: 5px; margin-top: 12px; font-weight: bold; text-align: center;">${getPressureText(data)}</p>
   `
}




function getCurrentDayName(data) {
	let date = data.location.localtime.split(" ");
   let localDateTime = date[0];
    let dateObject = new Date(date[0].replace(" ", "T"));
    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[dateObject.getDay()];
}
function getNextDayName(data) {
    let dateObject = new Date(data.replace(" ", "T"));
    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[dateObject.getDay()];
}

function getWeatherText(data){
	let current_text = data.current.condition.text;
	let weather_icon;
	switch(current_text) {
      case 'Cloudy':
      weather_icon = `<i class="fa-solid fa-cloud"></i>`;
      break;
		case "Patchy rain nearby":
      weather_icon = `<i class="fa-solid fa-cloud-sun-rain"></i>`;
      break;
    case "Sunny":
       weather_icon = `<i class="fa-solid fa-sun"></i>`;
       break;
    case "Clear":
       weather_icon = `<i class="fa-solid fa-sun"></i>`;
       break;
    case "Light rain shower":
       weather_icon = `<i class="fa-solid fa-cloud-sun-rain"></i>`;
       break;
    case "Partly Cloudy":
       weather_icon = `<i class="fa-solid fa-cloud-sun"></i>`;
       break;
    case "Partly cloudy":
       weather_icon = `<i class="fa-solid fa-cloud-sun"></i>`;
    break;
    case "Overcast":
       weather_icon = `<i class="fa-solid fa-cloud-sun"></i>`;
       break;
    case "Moderate rain":
       weather_icon = `<i class="fa-solid fa-cloud-rain"></i>`;
       break;
    case "Moderate or heavy rain with thunder":
       weather_icon = `<i class="fa-solid fa-cloud-bolt"></i>`;
       break;
       case "Thundery outbreaks in nearby":
       weather_icon = `<i class="fa-solid fa-cloud-bolt"></i>`;
       break;
    case "Moderate snow":
       weather_icon = `<i class="fa-solid fa-snowflake"></i>`;
       break;
    case "Fog":
       weather_icon = `<i class="fa-solid fa-smog"></i>`;
       break;
       case "Mist":
       weather_icon = `<i class="fa-solid fa-smog"></i>`;
       break;
		}

	 return `${weather_icon} <b>${current_text}</b>`;;
}
function getUVText(data) {
	let current_uv = Math.round(data.current.uv);
	let uv_inf;
	switch(true){
		case(current_uv >= 0 && current_uv <= 2):
       uv_inf = `Low`;
       break;
      case(current_uv >= 3 && current_uv <= 5):
       uv_inf = `Moderate`;
       break;
      case(current_uv >= 6 && current_uv <= 7):
       uv_inf = `High`;
       break;
       case(current_uv >= 8 && current_uv <= 10):
       uv_inf = `Very High`;
       break;
       case(current_uv >= 11):
       uv_inf = `Extreme`;
       break;
	}
	return uv_inf;
}
function getHumidityText(data) {
   let current_humidity = Math.round(data.current.humidity);
   let humidity_inf;
   switch(true){
      case(current_humidity >= 0 && current_humidity <= 34):
       humidity_inf = `Too Dry   <i class="fa-solid fa-thumbs-down"></i>`;
       break;
      case(current_humidity >= 35 && current_humidity <= 59):
       humidity_inf = `Normal   <i class="fa-solid fa-thumbs-up"></i>`;
       break;
      case(current_humidity >= 60 && current_humidity <= 100):
       humidity_inf = `Too Humid   <i class="fa-solid fa-thumbs-down"></i>`;
       break;
   }
   return humidity_inf;
}
function getVisibilityText(data) {
   let current_vis = Math.round(data.current.vis_km);
   let vis_inf;
   switch(true){
      case(current_vis >= 0 && current_vis <= 4):
       vis_inf = `Low`;
       break;
      case(current_vis >= 5 && current_vis <= 8):
       vis_inf = `Average`;
       break;
      case(current_vis >= 9):
       vis_inf = `High`;
       break;
   }
   return vis_inf;
}
function getPressureText(data) {
   let current_pressure = Math.round(data.current.pressure_mb);
   let pressure_inf;
   switch(true){
      case(current_pressure <= 1000):
       pressure_inf = `Low <i class="fa-solid fa-arrow-down"></i>`;
       break;
      case(current_pressure <= 1020):
       pressure_inf = `Normal   <i class="fa-solid fa-circle-check"></i>`;
       break;
      case(current_pressure > 1020):
       pressure_inf = `High <i class="fa-solid fa-arrow-up"></i>`;
       break;
   }
   return pressure_inf;
}

function phoneWeek() {
   let hWeek =  document.getElementById("week-text");
   let hTH = document.getElementById("TH-text");
   let today = document.getElementById("block_today");
   let weeknstats = document.getElementById("block_weeknstats");
   let week = document.getElementById("weekdays");
   let stats = document.getElementById("block_stats");
   hTH.style.display = 'none';
   today.style.display = 'none';
   weeknstats.style.display = 'block';
   hWeek.style.display = 'block';
   week.style.display = 'grid';
   stats.style.display = 'none';
}
function phoneStats() {
   let hWeek =  document.getElementById("week-text");
   let hTH = document.getElementById("TH-text");
   let today = document.getElementById("block_today");
   let weeknstats = document.getElementById("block_weeknstats");
   let week = document.getElementById("weekdays");
   let stats = document.getElementById("block_stats");
   hTH.style.display = 'block';
   today.style.display = 'none';
   weeknstats.style.display = 'block';
   hWeek.style.display = 'none';
   week.style.display = 'none';
   stats.style.display = 'grid';
}
function phoneLoc() {
   let hWeek =  document.getElementById("week-text");
   let hTH = document.getElementById("TH-text");
   let today = document.getElementById("block_today");
   let weeknstats = document.getElementById("block_weeknstats");
   let week = document.getElementById("weekdays");
   let stats = document.getElementById("block_stats");
   hTH.style.display = 'none';
   today.style.display = 'block';
   weeknstats.style.display = 'none';
   hWeek.style.display = 'none';
   week.style.display = 'none';
   stats.style.display = 'none';
}
