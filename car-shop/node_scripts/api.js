//"use strict";
const express = require('express');
const path = require("path");
const indexRouter = require('./routes/index');
const carmodelsRouter = require('./routes/carmodels');
const employeesRouter = require('./routes/employees');

const app = express();

// Handle static files in public dir
app.use(express.static(path.join(__dirname, "..", 'public')));

// Use carmodels.js file to handle all "carmodels" endpoints
app.use('/', indexRouter);
app.use("/carmodels", carmodelsRouter);
app.use("/employees", employeesRouter);

// Setting up server
const port = process.env.PORT || 4000
let server = app.listen(port, () => {
  let port = server.address().port;
  console.log("Listening on port", port);
});
