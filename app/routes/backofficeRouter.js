import express from 'express';
const router = express.Router();

import {getSimulatorPage} from '../controllers/backofficeController.js';

router.get('/', getSimulatorPage)

export default router