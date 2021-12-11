import express from 'express';
const router = express.Router();

import {getSimulatorParams, 
        putParamSource, 
        getParamSource, 
        getSimulatorScenario,
        putScenarioPointer,
        postScenario,
        deleteScenario
} from '../controllers/simulatorParamsController.js';

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


export default router