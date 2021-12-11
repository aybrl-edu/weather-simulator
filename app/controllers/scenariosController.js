import {getAllScenarios}  from '../models/database.js';

// Globals

// Simulator 
export const getScenarios =  (req, res) => {
    getAllScenarios(response => {
        res.send(response)
    })
}