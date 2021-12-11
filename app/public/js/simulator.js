//Params
var toggle_weather = true;
var toggle_custom = !toggle_weather;

//Elements
var tgWeatherElement      = null;
var tgCustomElement       = null;
var tempElement           = null;
var cloudElement          = null;
var rainElement           = null;
var windElement           = null;
var sunriseElement        = null;
var sunsetElement         = null;
var scenarioModalElement  = null;

//Globals
var params = {
    temperature     : 0,
    windSpeed       : 0,
    cloudsCover     : 0,
    precipitation   : 0,
    daylight        : 'DAY'
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
    tgWeatherElement         = document.getElementById("tg_weather");
    tgCustomElement          = document.getElementById("tg_custom");
    scenarioModalElement     = document.getElementById('scenario-modal')
    tgWeatherElement.checked = toggle_weather;
    tgCustomElement.checked  = toggle_custom;
}

function loadWeatherBox() {
    tempElement     = document.getElementById("temp-value");
    cloudElement    = document.getElementById("cloud-value");
    rainElement     = document.getElementById("rain-value");
    windElement     = document.getElementById("wind-value");
    daylightImage   = document.getElementById("daylight-img");
    daylightElement = document.getElementById("daylight-value");
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
    fetch('/v1/simulator/params')
    .then(res => res.json())
    .then(response => {
        if(response.code === "success") {
            params = response.conditionParams
            reloadConditionsValues()
        }
    })
    .catch(e => console.log(e))
}

function getScenarioParams(id, callback) {
    
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

function putScenarioPointer(id_scenario, callback) {
    const request = {
        method  : 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept' : 'application/json'},
        body    : JSON.stringify({idScenario : id_scenario})
    }
    fetch('/v1/simulator/params/pointer', request)
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
    tempElement.innerText       = params.temperature+'°C';
    cloudElement.innerText      = params.cloudsCover+'%';
    rainElement.innerText       = params.precipitation+'%';
    windElement.innerText       = params.windSpeed+'km/h';
    daylightImage.src           = (params.daylight === 'DAY') ? '/assets/icons/sun.png' : '/assets/icons/moon.png';
    daylightElement.innerText   = params.daylight;
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

function selectScenarioPointer(id) {
    putScenarioPointer(id, () => {
        if(toggle_custom) getWeatherParams()
    })
}

function addScenario() {
    const name          = document.getElementById("scenario-name").value;
    const wind          = document.getElementById("scenario-wind").value;
    const rain          = document.getElementById("scenario-rain").value;
    const efti          = document.getElementById("scenario-efti").value;
    const clouds        = document.getElementById("scenario-clouds").value;
    const daylight      = document.getElementById("scenario-daylight").value;
    const temperature   = document.getElementById("scenario-temperature").value;

    const request = {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json', 'Accept' : 'application/json'},
        body    : JSON.stringify({
            name        : name,
            wind        : wind,
            rain        : rain,
            efti        : efti,
            clouds      : clouds,
            daylight    : daylight,
            temperature : temperature
        })
    }
    fetch('/v1/simulator/scenario', request)
    .then(res => res.json())
    .then(response => {
        if(response.code === "success") reloadScenarioBox()
    })
    .catch(e => console.log(e))
}

function deleteScenario(idScenario) {

    let isHeSure = confirm("Are you sur ?");

    if(isHeSure) {
        const request = {
            method  : 'DELETE',
            headers : { 'Content-Type': 'application/json', 'Accept' : 'application/json'},
            body    : JSON.stringify({
                idScenario : idScenario
            })
        }
        fetch('/v1/simulator/scenario', request)
        .then(res => res.json())
        .then(response => {
            if(response.code === "success") reloadScenarioBox()
        })
        .catch(e => console.log(e))
    }
    
}

function openScenarioModal() {
    scenarioModalElement.style.display = 'flex'
}

function closeScenarioModal() {
    scenarioModalElement.style.display = 'none'
}

function reloadScenarioBox() {
    location.reload()
}

window.onclick = function(event) {
    if (event.target == scenarioModalElement) {
        scenarioModalElement.style.display = "none";
    }
}