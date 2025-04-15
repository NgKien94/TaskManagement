const express = require('express');
require('dotenv').config();

// Configs

const app = express();
const port = process.env.PORT;
const database = require('./config/database');
database.connect();


// Routes version 1
const routesApiVer1 = require('./api/v1/routes/index-route')
routesApiVer1(app);


app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
})