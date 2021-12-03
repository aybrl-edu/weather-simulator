import Pool from 'pg';

import dotenv from 'dotenv';

dotenv.config()

const poolSimulator = new Pool.Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     process.env.DB_PORT,
})

export const getDataSource = (callback) => {
    poolSimulator.query(
        'SELECT data_source, id_scenario FROM simulator_settings WHERE id_application=$1', [process.env.SIMULATOR_APP_ID],
        (error, results) => {
        if (error) callback({code : "error"})
        else if(results) callback({code : "success", dataSource : results.rows[0].data_source, idScenario : results.rows[0].id_scenario})
    })
}

export const getScenarioById = (id, callback) => {
    poolSimulator.query(
        'SELECT * FROM simulator_scenarios WHERE id_scenario=$1', [id],
        (error, results) => {
        if (error) callback({code : "error"})
        else if(results) callback(results.rows[0] || {})
    })
}

export const putDataSource = (source, callback) => {
    poolSimulator.query(
        'UPDATE simulator_settings SET data_source=$1 WHERE id_application=$2', [source, process.env.SIMULATOR_APP_ID],
        (error, results) => {
        if (error) callback({code : "error"})
        if(results) callback({code : "success"})
    })
}