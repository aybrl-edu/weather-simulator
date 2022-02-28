const {getAllScenarios, getSelectedScenarioId}  = require('../../models/old-version/database.js');


// Simulator 
exports.getSimulatorPage = (req, res) => {
    getAllScenarios(response => {
        if(response.code === "success") {
            let allScenarios = response.scenarios
            getSelectedScenarioId(response => {
                if(response.code === "success") {
                    res.render('pages/simulatorv1', {scenarios : allScenarios, selectedScenario : response.idScenario})
                }
                else console.error("error while rendring the simulator page")
            })
        }
        else throw response
    })
}