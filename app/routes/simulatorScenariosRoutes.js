import express from 'express';
const router = express.Router();

import {getScenarios} from '../controllers/scenariosController.js';

router.get('/', getScenarios)


export default router