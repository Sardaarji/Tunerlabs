const express = require('express');

const app = express();

var cookieParser = require('cookie-parser');

const companyRouter = require("./company/router");
const employeeRouter = require("./employee/router");


app.use(express.json());
app.use('/company', companyRouter);
app.use('/employee', employeeRouter);


module.exports = app;
