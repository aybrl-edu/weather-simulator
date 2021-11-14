const express = require('express')
const router = express.Router();

const controller = require('../controllers/simulatorParamsController')

router.get('/get', controller.getSimulatorParams)

module.exports = router