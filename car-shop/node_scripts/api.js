// Version 1.0
// const express = require('express');
// const path = require("path");
// const indexRouter = require('./routes/index');
// const carmodelsRouter = require('./routes/carmodels');
// const employeesRouter = require('./routes/employees');
//
// const app = express();
//
// // Handle static files in public dir
// app.use(express.static(path.join(__dirname, "..", 'public')));
//
// // Use respective router js file to handle all the specific endpoints
// app.use('/', indexRouter);
// app.use("/carmodels", carmodelsRouter);
// app.use("/employees", employeesRouter);
//
// // Setting up server
// const port = process.env.PORT || 4000
// let server = app.listen(port, () => {
//   let port = server.address().port;
//   console.log("Listening on port", port);
// });

// Version 2.0: Serverless, netflify

const express = require('express');
const path = require("path");
const indexRouter = require('./routes/index');
const carmodelsRouter = require('./routes/carmodels');
const employeesRouter = require('./routes/employees');

const serverless = require('serverless-http');
const app = express();

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(express.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
