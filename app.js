const express = require('express')
const dotenv  = require('dotenv')
const app = express()

const simulatorParamsRoutes = require("./app/routes/simulatorParamsRoutes");
const simulatorScenariosRoutes = require("./app/routes/simulatorScenariosRoutes");

//Config
dotenv.config()

//Globals
const port = process.env.PORT || 4040
const api_version = process.env.API_VERSION

//Middelwares

//routes
app.use(`/${api_version}/simulator/params`, simulatorParamsRoutes)
app.use(`/simulator/scenarios`, simulatorScenariosRoutes)

//Listen
app.listen(port, () => {console.log(`Simulator app listening at port : ${port}`)})