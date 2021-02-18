const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const router = express.Router();
router.use(express.json());

// Serve html file
router
  .route("/index")
  .get((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "employees.html"));
   // res.render(path.join(__dirname, "..", "..", "public", "views", "employees.html"));
    //res.end();
  });

// AJAX requests at root for employees
router
  .route("/")
  .get((req, res) => {
    fetch('https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/employees.json')
      .then(res => res.json())
      .then(json => res.send(json));
  });

module.exports = router;
