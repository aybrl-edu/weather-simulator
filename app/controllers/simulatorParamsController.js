import fetch from 'node-fetch';
import {getDataSource, putDataSource, getScenarioById}  from '../models/database.js';

// Globals

// Simulator 
export const getSimulatorParams =  (req, res) => {
    // Check the DATA source {Weather API, Cutom Scenarios}
    getDataSource(response => {
        // Interogate the data source
        switch(response.dataSource) {
            case 'WEATHER' : 
                getWeatherFromAPI((response) => {
                    res.send(response)
                })
                break;
            case 'CUSTOM' : 
                getScenarioById(response.idScenario, (response) => {
                    if(response.code) res.send(response)
                    else res.send({code : "success", conditionParams : scenarioDataToParamsObj(response)})
                })
                break;
            default : 
                res.send({"status" : "error", "message" : "Internal error : Invalid Data Source"})
        }
    });
}

export const getSimulatorScenario = (req, res) => {
    const idScenario = req.params.idScenario
    getScenarioById(idScenario, (response) => {
        res.send(response)
    })
}

// Param Source
export const getParamSource = (req, res) => {
    getDataSource(response => {
        res.send(response)
    });
}
export const putParamSource = (req, res) => {
    const source = req.body.source
    putDataSource(source, response => res.send(response))
}

// Workers
const getWeatherFromAPI = (callback) => {
    fetch(`https://api.openweathermap.org/data/${process.env.WEATHER_API_VERSION}/weather?q=${process.env.WEATHER_API_CITY}&appid=${process.env.WEATHER_API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
        callback({code : "success", conditionParams : weatherDataToParamsObj(data)})
    })
    .catch((e) => callback({code : "error", message : "an error has occured while trying to retrieve weather data", "message" : e.message}))
}

// Helpers
const weatherDataToParamsObj = (data) => {  
    const paramsObj = {...import('../models/conditionsObject.js')}
    paramsObj.condition     = data.weather.main
    paramsObj.temperature   = data.main.temp
    paramsObj.windSpeed     = data.wind.speed
    paramsObj.cloudsCover   = data.clouds.all
    paramsObj.sunrise       = data.sys.sunrise 
    paramsObj.sunset        = data.sys.sunset
    paramsObj.precipitation = (data.rain) ? data.rain["1h"] ? data.rain["1h"] : data.rain["3h"] : 0
    return paramsObj
}

const scenarioDataToParamsObj = (data) => {
    const paramsObj = {...import('../models/conditionsObject.js')}
    paramsObj.temperature   = data.temperature
    paramsObj.windSpeed     = data.wind_speed
    paramsObj.cloudsCover   = data.cloud_coverage
    paramsObj.sunrise       = data.sunrise 
    paramsObj.sunset        = data.sunset
    paramsObj.precipitation = data.rain_volume
    return paramsObj
}