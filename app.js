const express    = require('express');
const dotenv     = require('dotenv');
const bodyParser = require('body-parser');
const path       = require('path');
const cors       = require('cors');

const { Worker }  = require('worker_threads');

const backofficeRouter = require("./app/routes/backofficeRouter.js");
const backofficeRouterV1 = require("./app/routes/old-version/backofficeRouter.js");

const simulatorParamsRoutes = require("./app/routes/simulatorParamsRoutes.js");
const simulatorParamsRoutesV1 = require("./app/routes/old-version/simulatorParamsRoutes.js");

const simulatorScenariosRoutes = require("./app/routes/old-version/simulatorScenariosRoutes.js");

//Config
const app = express()
dotenv.config()
app.use(cors())

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
app.use(`/v1/simulator`, simulatorParamsRoutesV1)
app.use(`/${api_version}/simulator`, simulatorParamsRoutes)

//Backoffice Routes
app.use(`/simulator/scenarios`, simulatorScenariosRoutes)

//Pages Routes
app.use('/simulator', backofficeRouter);
app.use('/simulator/old', backofficeRouterV1);

//Listen
app.listen(port, () => {console.log(`Simulator app listening at port : ${port}`)})