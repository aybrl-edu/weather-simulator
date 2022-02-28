var pauseSimulator = false;
var simulatorFrequency = 60 * 1000 
var scenario = null

module.exports.getSimulatorPause = () => {
    return pauseSimulator;
}

module.exports.getSimulatorFrequency = () => {
    return simulatorFrequency;
}

module.exports.getScenarioData = () => {
    return scenario;
}


module.exports.setSimulatorPause = (pause) => {
    pauseSimulator = pause;
}

module.exports.setSimulatorFrequency = (freq) => {
    simulatorFrequency = freq;
}

module.exports.setScenarioData = (scenario) => {
    scenario = scenario;
}