const express = require("express");
const path = require("path");
const dbOperations = require(path.join(".", "..", "db-operations"));

let router = express.Router();
router.use(express.json());

// AJAX requests at root for employees
router
  .route("/")
  .get((req, res) => {
    // dbOperations.getAllMembers().then((result => res.send(result)));
    res.send("hello from employees");
  });

module.exports = router;
