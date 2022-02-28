const axios = require('axios');

const {getSimulatorFrequency, getSimulatorPause, getSelectedScenario}  = require('./threadVirtualMemory.js');

var mainCounter = 0

var pause = getSimulatorPause();
var freq = getSimulatorFrequency();

const simulatorTime = {
    'hours' : 00,
    'minutes' : 00,
    'seconds' : 00
}


setInterval(async () => {
    // Time notion of the simulator
    if(!pause) {
        // Time pause
        updateTime()
        if(mainCounter % freq == 0) {} 
    }
    mainCounter++
}, 0)

module.exports.updateFrequency = (frequencyValue) => {
    freq = frequencyValue
}

module.exports.updatePause = (pauseValue) => {
    pause = pauseValue
}

module.exports.sendSimulatorTime = () => {
    return simulatorTime
}

function updateTime() {
    if(simulatorTime.seconds === 59) {
        simulatorTime.seconds = 00
        if(simulatorTime.minutes === 59) {
            simulatorTime.minutes = 00
            if(simulatorTime.hours == 23) {
                simulatorTime.hours = 00
            }
            else simulatorTime.hours++
        } else simulatorTime.minutes++
    }else simulatorTime.seconds++
}
