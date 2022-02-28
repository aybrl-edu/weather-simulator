const Pool = require('pg');

const dotenv = require('dotenv');

dotenv.config()

const poolSimulator = new Pool.Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     process.env.DB_PORT,
})

exports.getDataSource = (callback) => {
    poolSimulator.query(
        'SELECT data_source, id_scenario FROM simulator_settings WHERE id_application=$1', [process.env.SIMULATOR_APP_ID],
        (error, results) => {
        if (error) callback({code : "error"})
        else if(results) callback({code : "success", dataSource : results.rows[0].data_source, idScenario : results.rows[0].id_scenario})
    })
}

exports.getScenarioById = id => {
    return new Promise(resolve => {
        poolSimulator.query(
            'SELECT * FROM scenario_v2 WHERE id_scenario=$1', [id],
            (error, results) => {
                if (error) resolve({code : "error"})
                else if(results) resolve(results.rows[0] || {})
        })
    })
}

exports.getScenarioIntervals = id => {
    return new Promise(resolve => {
        poolSimulator.query(
            'SELECT * FROM scenario_intervals WHERE id_scenario=$1', [parseInt(id)],
            (error, results) => {
                if (error) resolve({code : "error", message : error.message})
                else if(results) resolve(results.rows || {})
        })
    })
}

exports.getIntervalValues = id => {
    return new Promise(resolve => {
        poolSimulator.query(
            'SELECT * FROM interval_values WHERE id_interval=$1', [id],
            (error, results) => {
                if (error) resolve({code : "error"})
                else if(results) resolve(results.rows || {})
        })
    })
}

exports.getAllScenarios = () => {
    return new Promise(resolve => {
        poolSimulator.query(
            `SELECT * FROM scenario_v2`,
            (error, results) => {
            if (error) resolve({code : "error" , message : error.message})
            if(results) resolve({code : "success", scenarios : results.rows})
        })
    })
}

exports.getSelectedScenarioId = async () => {
    return new Promise(resolve => {
        poolSimulator.query(
            'SELECT id_scenario FROM scenario_pointer WHERE id_app=$1', [process.env.SIMULATOR_APP_ID],
            (error, results) => {
            if (error) resolve({code : "error", message : error.message})
            if(results) resolve({code : "success", idScenario : results.rows[0]["id_scenario"]})
        })
    })
}

exports.insertScenario = (scenario_name, callback) => {
    poolSimulator.query(
        `INSERT INTO scenario_v2(scenario_name) VALUES ($1) RETURNING id_scenario`, 
            [scenario_name],
        (error, results) => {
            if (error) callback({code : "error", message : error.message})
            if(results) callback({code : "success", results : results})
        }
    )
}

exports.insertScenarioInterval = (scenarioInterval, idScenario, callback) => {
    poolSimulator.query(
        `INSERT INTO scenario_intervals(param_type, id_scenario) VALUES ($1, $2) RETURNING id_scenario_intervals`, 
            [scenarioInterval.param_type, idScenario],
        
        (error, results) => {
            if (error) callback({code : "error", message : error.message})
            if(results) callback({code : "success", results : results})
        }
    )
}

exports.insertScenarioValues = (scenarioValues, id_interval, callback) => {
    poolSimulator.query(
        `INSERT INTO interval_values(interval_from_to, interval_inf_bound, interval_sup_bound, id_interval) 
        VALUES ($1, $2, $3, $4)`, 
        [scenarioValues.from_to, scenarioValues.inf, scenarioValues.sup, id_interval],
        (error, results) => {
            if (error) callback({code : "error", message : error.message})
            if(results) callback({code : "success", results : results})
        }
    )
}


exports.dropScenario = (id, callback) => {
    poolSimulator.query(
        'DELETE FROM scenario_v2 WHERE id_scenario=$1', [id],
        (error, results) => {
        if (error) callback({code : "error"})
        if(results) callback({code : "success"})
    })
}

exports.dropInterval = id => {
    return new Promise(resolve => {
        poolSimulator.query(
            'DELETE FROM scenario_intervals WHERE id_scenario=$1', [id],
            (error, results) => {
            if (error) resolve({code : "error"})
            if(results) resolve({code : "success"})
        })
    })
}

exports.dropValues = id => {
    return new Promise(resolve => {
        poolSimulator.query(
            'DELETE FROM interval_values WHERE id_interval=$1', [id],
            (error, results) => {
            if (error) resolve({code : "error"})
            if(results) resolve({code : "success"})
        })
    })
}

exports.putDataSource = (source, callback) => {
    poolSimulator.query(
        'UPDATE simulator_settings SET data_source=$1 WHERE id_application=$2', [source, process.env.SIMULATOR_APP_ID],
        (error, results) => {
        if (error) callback({code : "error"})
        if(results) callback({code : "success"})
    })
}

exports.putParamsScenarioId = (idScenario, callback) => {
    poolSimulator.query(
        'UPDATE scenario_pointer SET id_scenario=$1 WHERE id_app=$2', [idScenario, process.env.SIMULATOR_APP_ID],
        (error, results) => {
        if (error) callback({code : "error"})
        if(results) callback({code : "success"})
    })
}