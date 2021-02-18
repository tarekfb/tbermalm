const express = require("express");
const path = require("path");
const fetch = require('node-fetch');

let router = express.Router();
router.use(express.json());

// AJAX requests at root for carmodels
router
  .route("/")
  .get((req, res) => {
    fetch('https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/carmodels.json')
      .then(res => res.json())
      .then(json => res.send(json));
  })
  .post((req, res) => {
    // dbOperations.registerMember(req.body).then(result => {res.send(result)});
  })
  .put((req, res) => {
    // dbOperations.updateMember(req.body).then(result => {res.send(result)});
  })
  .delete;

module.exports = router;
