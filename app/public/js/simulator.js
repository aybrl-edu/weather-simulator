//Params
var toggle_weather = true;
var toggle_custom = !toggle_weather;

//Elements
var tgWeatherElement    = null;
var tgCustomElement     = null;
var tempElement         = null;
var cloudElement        = null;
var rainElement         = null;
var windElement         = null;
var sunriseElement      = null;
var sunsetElement       = null;

//Globals
var params = {
    temperature     : 0,
    windSpeed       : 0,
    cloudsCover     : 0,
    sunrise         : 0,
    sunset          : 0,
    precipitation   : 0 
}

var DATA_SOURCE = null

//On load
window.onload = function() {
    loadNavBar()
    loadSimulator()
    loadWeatherBox()
    getParamSource()
    getWeatherParams()
};

//Initializers
function __init_conditions() {

}

//Loaders
function loadSimulator() {
    tgWeatherElement    = document.getElementById("tg_weather");
    tgCustomElement     = document.getElementById("tg_custom");
    tgWeatherElement.checked = toggle_weather;
    tgCustomElement.checked  = toggle_custom;
}

function loadWeatherBox() {
    tempElement     = document.getElementById("temp-value");
    cloudElement    = document.getElementById("cloud-value");
    rainElement     = document.getElementById("rain-value");
    windElement     = document.getElementById("wind-value");
    sunriseElement  = document.getElementById("sunrise-value");
    sunsetElement   = document.getElementById("sunset-value");
    reloadConditionsValues()
}

function loadNavBar() {
    const clock = document.getElementById("nav-time");
    setInterval(() => {
        clock.innerHTML  = new Date().toString().split(" ").slice(0, 5).join(" ")
    }, 1000)
}

//API Calls
function getParamSource() {
    fetch('/v1/simulator/paramsource')
    .then(res => res.json())
    .then(response => {
        if(response.code === "success") {
            DATA_SOURCE = response.dataSource
            toggle_weather = (DATA_SOURCE === "WEATHER")
            toggle_custom  = !toggle_weather
            reloadToggle()
        }
    })
    .catch(e => console.log(e))
}
function getWeatherParams() {
    fetch('v1/simulator/params')
    .then(res => res.json())
    .then(response => {
        if(response.code === "success") {
            params = response.conditionParams
            reloadConditionsValues()
        }
    })
    .catch(e => console.log(e))
}

function getScenarioParams(id) {
    
}

function putParamsSource(paramsource, callback) {
    const request = {
        method  : 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept' : 'application/json'},
        body    : JSON.stringify({source : paramsource})
    }
    fetch('/v1/simulator/paramsource', request)
    .then(res => res.json())
    .then(response => {
        if(response.code === "success") callback()
    })
    .catch(e => console.log(e))
}


//Element Manipulation
function reloadToggle() {
    tgWeatherElement.checked = toggle_weather;
    tgCustomElement.checked = toggle_custom;
}

function reloadConditionsValues() {
    tempElement.innerText     = params.temperature+'°C';
    cloudElement.innerText    = params.cloudsCover+'%';
    rainElement.innerText     = params.precipitation+'%';
    windElement.innerText     = params.windSpeed+'km/h';
    sunriseElement.innerText  = new Date(params.sunrise * 1000).toString().split(' ').slice(4,6).join(' ');
    sunsetElement.innerText   = new Date(params.sunset * 1000).toString().split(' ').slice(4,6).join(' ');
}

function toggleSource() {
    toggle_weather = !toggle_weather
    toggle_custom = !toggle_weather
    DATA_SOURCE = toggle_weather ? 'WEATHER' : 'CUSTOM'
    putParamsSource(DATA_SOURCE, () => {
        getWeatherParams()
    })
    reloadToggle()
}

//Variables Setters