const axios = require('axios');

const {getSimulatorFrequency, getSimulatorPause, getSelectedScenario}  = require('./threadVirtualMemory.js');

var mainCounter = 0
var accelerator = 1

var pause = getSimulatorPause();
var freq = getSimulatorFrequency();

const simulatorTime = {
    'hours' : 00,
    'minutes' : 00,
    'seconds' : 00
}


// setInterval(async () => {
//     // Time notion of the simulator
//     if(!pause) { 
//         // Time pause
//         updateTime()
//         if(mainCounter % freq == 0) {} 
//     }
//     mainCounter++
// }, 0)

module.exports.updateFrequency = (frequencyValue) => {
    //freq = frequencyValue
    accelerator = Number.parseFloat(frequencyValue)
}

module.exports.updatePause = (pauseValue) => {
    pause = pauseValue
}

module.exports.sendSimulatorTime = () => {
    return simulatorTime
}

module.exports.updateTime = () => {
    mainCounter++

    let acceleratorBis = accelerator

    // x0.5 speed
    if (accelerator === 0.5 && mainCounter % 4 !== 0) return;
    if (accelerator === 0.7 && mainCounter % 2 !== 0) return;
    
    if (accelerator < 1) acceleratorBis = 1
    
    simulatorTime.seconds = 00
    if(simulatorTime.minutes >= 59) {
        simulatorTime.minutes = 00
        if(simulatorTime.hours == 23) {
            simulatorTime.hours = 00
        }
        else simulatorTime.hours++
    } else {
        simulatorTime.minutes+=acceleratorBis
        if(simulatorTime.minutes >= 59) simulatorTime.minutes = 59
    }
}
