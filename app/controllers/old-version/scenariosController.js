const {getAllScenarios}  = require('../../models/old-version/database.js');

// Globals

// Simulator 
exports.getScenarios =  (req, res) => {
    getAllScenarios(response => {
        res.send(response)
    })
}