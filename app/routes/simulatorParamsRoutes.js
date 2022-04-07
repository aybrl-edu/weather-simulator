const express = require('express');
const router = express.Router();

const { 
        putParamSource, 
        getParamSource, 
        getSimulatorScenario,
        getSimulatorScenarios,
        putScenarioPointer,
        postScenario,
        setPauseSimulator,
        getSimulationParams,
        setSimulatorFrequency,
        deleteScenario,
        getSimulatorTimeL
} = require('../controllers/simulatorParamsController.js');

//Params
router.get('/params', getSimulationParams)
router.put('/params/pointer', putScenarioPointer)

//Scenarios
router.get('/scenarios', getSimulatorScenarios)
router.get('/scenarios/:idScenario', getSimulatorScenario)
router.post('/scenario', postScenario)
router.delete('/scenario', deleteScenario)


//Source
router.get('/paramsource', getParamSource)
router.put('/paramsource', putParamSource)

//Time
router.post('/pause', setPauseSimulator)
router.post('/frequency', setSimulatorFrequency)
router.get('/time', getSimulatorTimeL)


module.exports = router