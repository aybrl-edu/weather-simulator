import express    from 'express';
import dotenv     from 'dotenv';
import bodyParser from 'body-parser';
import path       from 'path';

import backofficeRouter from "./app/routes/backofficeRouter.js";
import simulatorParamsRoutes from "./app/routes/simulatorParamsRoutes.js";
import simulatorScenariosRoutes from "./app/routes/simulatorScenariosRoutes.js";

//Config
const app = express()
dotenv.config()

//View
app.set('views', path.join(path.resolve(), 'app', 'views'));
app.set('view engine', 'ejs');

//Public
app.use(express.static('./app/public'));

//Globals
const port = process.env.PORT || 4040
const api_version = process.env.API_VERSION

//Middelwares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//Api Routes
app.use(`/${api_version}/simulator`, simulatorParamsRoutes)

//Backoffice Routes
app.use(`/simulator/scenarios`, simulatorScenariosRoutes)

//Pages Routes
app.use('/simulator', backofficeRouter);

//Listen
app.listen(port, () => {console.log(`Simulator app listening at port : ${port}`)})