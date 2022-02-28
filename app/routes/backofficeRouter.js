const express = require('express');
const router = express.Router();

const {getSimulatorPage} = require('../controllers/backofficeController.js');

router.get('/', getSimulatorPage)

module.exports = router