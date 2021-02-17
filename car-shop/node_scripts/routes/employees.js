const express = require("express");
const path = require("path");
const dbOperations = require(path.join(".", "..", "db-operations"));
const fetch = require('node-fetch');
let router = express.Router();
router.use(express.json());

// AJAX requests at root for employees
router
  .route("/")
  .get((req, res) => {
    fetch('https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/employees.json')
      .then(res => res.json())
      .then(json => res.send(json));
  });

module.exports = router;
