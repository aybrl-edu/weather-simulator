import express from 'express';
const router = express.Router();

import {getSimulatorParams} from '../controllers/simulatorParamsController.js';

router.get('/', getSimulatorParams)

export default router