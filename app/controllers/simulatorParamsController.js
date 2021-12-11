import fetch from 'node-fetch';
import {getDataSource, putDataSource, getScenarioById, putParamsScenarioId, insertScenario, dropScenario}  from '../models/database.js';

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

export const putScenarioPointer = (req, res) => {
    const idScenario = req.body.idScenario
    putParamsScenarioId(idScenario, response => res.send(response))
}

export const postScenario =  (req, res) => {
    const scenario = {
        name          : req.body.name,
        wind          : req.body.wind,
        rain          : req.body.rain,
        efti          : req.body.efti,
        clouds        : req.body.clouds,
        daylight      : req.body.daylight,
        temperature   : req.body.temperature
    }

    insertScenario(scenario, response => {
        res.send(response)
    })
}

export const deleteScenario =  (req, res) => {
    const id = req.body.idScenario
    dropScenario(id, response => {
        res.send(response)
    })
}

// Workers
const getWeatherFromAPI = (callback) => {
    fetch(`https://api.openweathermap.org/data/${process.env.WEATHER_API_VERSION}/weather?q=${process.env.WEATHER_API_CITY}&appid=${process.env.WEATHER_API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => callback({code : "success", conditionParams : weatherDataToParamsObj(data)}))
    .catch((e) => callback({code : "error", message : e.message}))
}

// Helpers
const weatherDataToParamsObj = (data) => {  
    let now = Date.now()
    const paramsObj = {...import('../models/conditionsObject.js')}
    paramsObj.condition     = data.weather.main
    paramsObj.temperature   = data.main.temp
    paramsObj.windSpeed     = (data.wind.speed * 3.6).toFixed(2)
    paramsObj.cloudsCover   = data.clouds.all
    paramsObj.daylight      = (now > data.sys.sunrise && now < data.sys.sunset) ? 'DAY' : 'NIGHT'
    paramsObj.precipitation = (data.rain) ? data.rain["1h"] ? data.rain["1h"] : data.rain["3h"] : 0
    return paramsObj
}

const scenarioDataToParamsObj = (data) => {
    const paramsObj = {...import('../models/conditionsObject.js')}
    paramsObj.temperature   = data.temperature
    paramsObj.windSpeed     = data.wind_speed
    paramsObj.cloudsCover   = data.cloud_coverage
    paramsObj.daylight      = data.daylight
    paramsObj.precipitation = data.rain_volume
    return paramsObj
}