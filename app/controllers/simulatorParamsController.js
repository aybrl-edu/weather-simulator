const fetch = require('node-fetch');
const {getDataSource, 
    putDataSource, 
    getScenarioById, 
    putParamsScenarioId, 
    insertScenario,
    insertScenarioInterval,
    insertScenarioValues,
    getScenarioIntervals, 
    dropScenario, 
    getAllScenarios,
    dropValues,
    getIntervalValues,
    dropInterval,
    getSelectedScenarioId
    } = require('../models/database.js');

var {setSimulatorPause, 
    setSimulatorFrequency,
    setScenarioData
} = require('../workers/threadVirtualMemory.js');

var {updateFrequency,updatePause, sendSimulatorTime, updateTime} = require('../workers/conditionGenerator.js');

// Globals

// Simulator 
exports.getSimulatorParams =  (req, res) => {
    // Check the DATA source {Weather API, Cutom Scenarios}
    getDataSource(response => {
        // Interogate the data source
            switch (response.dataSource) {
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

exports.getSimulatorScenario = async (req, res) => {
    const idScenario = req.params.idScenario
    const response = await getScenarioFromDB(idScenario)
    res.send(response)
}

exports.getSimulatorScenarios = async (req, res) => {
    const response = await getAllScenariosFromDB()
    res.send(response)
}


// Param Source
exports.getParamSource = (req, res) => {
    getDataSource(response => {
        res.send(response)
    });
}

exports.putParamSource = (req, res) => {
    const source = req.body.source
    putDataSource(source, response => res.send(response))
}

exports.putScenarioPointer = (req, res) => {
    const idScenario = req.body.idScenario
    putParamsScenarioId(idScenario, response => res.send(response))
}

exports.postScenario =  (req, res) => {
    let state = 0;
    let idScenario = null;

    insertScenario(req.body.scenario_name, req.body.season, req.body.daytype, response => {
        if(response.code === "success") {
            idScenario = response.results.rows[0].id_scenario
            let scenarioIntervals = req.body.scenario_intervals
            let isIntevalsLast = false
            for(let i = 0 ; i < scenarioIntervals.length ; i++) {
                if(i === scenarioIntervals.length - 1) isIntevalsLast = true
                // insert interval 
                insertScenarioInterval(scenarioIntervals[i], idScenario, response => {
                    if(response.code === "success") {
                        let idInterval = response.results.rows[0].id_scenario_intervals
                        let intervalValues = scenarioIntervals[i].interval_values;
                        for(let j = 0 ; j < intervalValues.length ; j++) {
                            // insert interval values
                            insertScenarioValues(intervalValues[j], idInterval, () => {
                                if(response.code !== "success") return;
                            })
                        }
                    } else return;
                })
            } 
            res.send({"code" : "success", "message" : "scenario inserted succefully. ID : "+idScenario})
        } else return;
    })
}
exports.deleteScenario =  async (req, res) => {
    const id = req.body.idScenario
    let intervals = await getScenarioIntervals(id)
    if(intervals.code === "error") res.send(intervals)
    for(let i=0 ; i<intervals.length ; i++) {
        await dropValues(intervals[i].id_scenario_intervals)
    }
    await dropInterval(id)
    dropScenario(id, resp => res.send(resp))
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
    paramsObj.efti          = data.efti
    return paramsObj
}

async function getAllScenariosFromDB () {
    
    let response = []
    const scenariosRes = await getAllScenarios()
    
    let scenarios = scenariosRes.scenarios

    for(let i = 0; i < scenarios.length; i++) {
        let scenarioObj = await getScenarioFromDB(scenarios[i].id_scenario)
        response.push(scenarioObj)
    }

    return response;
}

exports.getAllScenariosWithMinMaxFromDB = async () => {
    
    let response = []
    const scenariosRes = await getAllScenarios()
    
    let scenarios = scenariosRes.scenarios

    for(let i = 0; i < scenarios.length; i++) {
        let scenarioObj = await getScenarioWithMinMaxFromDB(scenarios[i].id_scenario)
        response.push(scenarioObj)
    }

    return response;
}

async function getScenarioFromDB (idScenario) {
    
    let scenarioRes = await getScenarioById(idScenario)

    if(scenarioRes.code === "error" || !scenarioRes.id_scenario) return scenarioRes

    let scenarioObj = {
        "id_scenario" : idScenario,
        "scenario_name" : scenarioRes.scenario_name,
        "season" : scenarioRes.season,
        "daytype" :scenarioRes.daytype,
        "scenario_intervals" : []
    }
    
    let intervals = await getScenarioIntervals(idScenario)
    
    if(intervals.code === "error") return intervals

    for(let j = 0; j < intervals.length; j++) {
        let intervalObj = {
            "id_interval" : intervals[j].id_scenario_intervals,
            "param_type" : intervals[j].param_type,
            "interval_values" : [] 
        }
        let valuesRes = await getIntervalValues(intervals[j].id_scenario_intervals)
        if(valuesRes.code !== "error") {
            intervalObj.interval_values.push(valuesRes)
        }
        scenarioObj.scenario_intervals.push(intervalObj)
    }
    
    return scenarioObj;
}


const getScenarioWithMinMaxFromDB = async (idScenario) => {
    
    let scenarioRes = await getScenarioById(idScenario)

    if(scenarioRes.code === "error" || !scenarioRes.id_scenario) return scenarioRes

    let scenarioObj = {
        "scenario_id" : idScenario,
        "scenario_name" : scenarioRes.scenario_name,
        "interval_values" : []
    }
    
    let intervals = await getScenarioIntervals(idScenario)    
    
    if(intervals.code === "error") return intervals

    for(let j = 0; j < intervals.length; j++) {
        let valuesRes = await getIntervalValues(intervals[j].id_scenario_intervals)
        
        if(valuesRes.code !== "error") {
            let intervalValuesObj = {
                "type_param" : intervals[j].param_type,
                "min" : null,
                "max" : null
            }
    
            let min = Number.POSITIVE_INFINITY
            let max = Number.NEGATIVE_INFINITY
            // 3, 4, 5, 10 ,2, 12
            for(let i = 0; i < valuesRes.length; i++) {
                //3,
                if(valuesRes[i].interval_inf_bound < min) min = valuesRes[i].interval_inf_bound
                //3, 4, 5
                if(valuesRes[i].interval_sup_bound > max) max = valuesRes[i].interval_sup_bound
            }
            intervalValuesObj.min = min
            intervalValuesObj.max = max

            scenarioObj.interval_values.push(intervalValuesObj)
        }
    }
    
    return scenarioObj;
}

exports.setSimulatorFrequency = (req, res) => {
    setSimulatorFrequency(req.body.frequency)
    updateFrequency(req.body.frequency)
    res.send({"code" : "success"})
}

exports.setPauseSimulator = (req, res) => {
    setSimulatorPause(req.body.pause)
    updatePause(req.body.pause)
    res.send({"code" : "success"})
}

exports.getSimulatorTimeL = (req, res) => {
    res.send({"code" : "success", "time" : sendSimulatorTime()})
}

exports.getSimulationParams = async (req, res) => {
    updateTime()
    // init
    const generatedParams = {
        "temperature" : 0,
        "wind" : 0,
        "precipitations" : 0,
        "clouds" : 0,
    }
    const actualConditions = {
        time : null, // SimulTime
        params : null, //GenParams
        season : null,
        daytype : null
    }

    // scenario
    const selectedScenario = await getSelectedScenarioId()
    let scenario = await getScenarioFromDB(selectedScenario.idScenario)
    let currentInterval = getIntervalFromTime(sendSimulatorTime())
    
    let tempInterval = 0
    let windInterval = 0
    let prepInterval = 0
    let cloudsInterval = 0

    // interval
    scenario.scenario_intervals.map(sc_interval => {
        switch(sc_interval.param_type) {
            case 'temperature' : tempInterval = getValueFromInterval(sc_interval.interval_values, currentInterval)
            case 'wind' : windInterval = getValueFromInterval(sc_interval.interval_values, currentInterval)
            case 'precipitations' : prepInterval = getValueFromInterval(sc_interval.interval_values, currentInterval)
            case 'clouds' : cloudsInterval = getValueFromInterval(sc_interval.interval_values, currentInterval)
        }
    })

    // values
    generatedParams.temperature = generateRandom(tempInterval.inf, tempInterval.sup)
    generatedParams.clouds = generateRandom(cloudsInterval.inf, cloudsInterval.sup)
    generatedParams.wind = generateRandom(windInterval.inf, windInterval.sup)
    generatedParams.precipitations = generateRandom(prepInterval.inf, prepInterval.sup)

    // response
    actualConditions.time = sendSimulatorTime()
    actualConditions.params = generatedParams
    actualConditions.season = scenario.season
    actualConditions.daytype = scenario.daytype

    res.send(actualConditions);
}

// Helplers

function getIntervalFromTime(simulatorTime) {
    if(simulatorTime.hours >= 0 && simulatorTime.hours < 6) return "00h-06h"
    if(simulatorTime.hours >= 6 && simulatorTime.hours < 12) return "06h-12h"
    if(simulatorTime.hours >= 12 && simulatorTime.hours < 18) return "12h-18h"
    if(simulatorTime.hours >= 18) return "18h-00h"
}

function getValueFromInterval(values, interval) {
    let intervalRes = {
        'inf' : 0,
        'sup' : 0
    }
    values.filter(valueArr => {
        valueArr.filter(value => {
           if(value.interval_from_to === interval){
                intervalRes.inf = value.interval_inf_bound
                intervalRes.sup = value.interval_sup_bound
                return;
           }
        })
    })
    return intervalRes
}

function generateRandom(min , max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}