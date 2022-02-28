const {getAllScenarios, getSelectedScenarioId}  = require('../models/database.js');
const {getAllScenariosWithMinMaxFromDB}  = require('./simulatorParamsController.js');

// Simulator 
exports.getSimulatorPage =  async (req, res) => {
    
    let scenarios = await getAllScenariosWithMinMaxFromDB()
    let selectedScenario = await getSelectedScenarioId()

    if(scenarios.code !== "success") {
        res.render('pages/simulator', {scenarios : scenarios, selectedScenario : selectedScenario.idScenario})
    }

    else console.error("error while rendring the simulator page")
}
