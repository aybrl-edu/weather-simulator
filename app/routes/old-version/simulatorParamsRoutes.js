const express = require('express');
const router = express.Router();

const {getSimulatorParams, 
        putParamSource, 
        getParamSource, 
        getSimulatorScenario,
        putScenarioPointer,
        postScenario,
        deleteScenario
} = require('../../controllers/old-version/simulatorParamsController.js');

//Params
router.get('/params', getSimulatorParams)
router.put('/params/pointer', putScenarioPointer)

//Scenarios
router.get('/scenarios/:idScenario', getSimulatorScenario)
router.post('/scenario', postScenario)
router.delete('/scenario', deleteScenario)


//Source
router.get('/paramsource', getParamSource)
router.put('/paramsource', putParamSource)


module.exports = router