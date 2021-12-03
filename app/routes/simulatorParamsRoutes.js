import express from 'express';
const router = express.Router();

import {getSimulatorParams, putParamSource, getParamSource, getSimulatorScenario} from '../controllers/simulatorParamsController.js';

//Params
router.get('/params', getSimulatorParams)

//Scenarios
router.get('/scenarios/:idScenario', getSimulatorScenario)


//Source
router.get('/paramsource', getParamSource)
router.put('/paramsource', putParamSource)

export default router