const express = require('express');
const router = express.Router();

const {getScenarios} = require('../../controllers/old-version/scenariosController.js');

router.get('/', getScenarios)


module.exports = router