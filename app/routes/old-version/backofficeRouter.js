const express = require('express');
const router = express.Router();

const {getSimulatorPage} = require('../../controllers/old-version/backofficeController.js');

router.get('/', getSimulatorPage)

module.exports = router