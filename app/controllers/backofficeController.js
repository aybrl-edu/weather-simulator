import {getAllScenarios, getSelectedScenarioId}  from '../models/database.js';


// Simulator 
export const getSimulatorPage =  (req, res) => {
    getAllScenarios(response => {
        if(response.code === "success") {
            let allScenarios = response.scenarios
            getSelectedScenarioId(response => {
                if(response.code === "success") {
                    res.render('pages/simulator', {scenarios : allScenarios, selectedScenario : response.idScenario})
                }
                else console.error("error while rendring the simulator page")
            })
        }
        else throw response.message
    })
}