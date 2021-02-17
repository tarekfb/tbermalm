const express = require("express");
const path = require("path");
const dbOperations = require(path.join(".", "..", "db-operations"));

let router = express.Router();
router.use(express.json());

// AJAX requests at root for carmodels
router
  .route("/")
  .get((req, res) => {
    // dbOperations.getAllMembers().then((result => res.send(result)));
  })
  .post((req, res) => {
    // dbOperations.registerMember(req.body).then(result => {res.send(result)});
  })
  .put((req, res) => {
    // dbOperations.updateMember(req.body).then(result => {res.send(result)});
  })
  .delete;

module.exports = router;
