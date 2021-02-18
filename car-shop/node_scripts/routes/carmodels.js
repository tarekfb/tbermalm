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
  .delete((req, res) => {

  });

// Firebase automatically generates a unique key for the newly added item
// This is good, because it prevents multiple post calls happening simultaneously from causing issues
// But the naming scheme does not align with current convention
// Therefore we perform a patch request and update the value to latest item + 1

// docs: https://firebase.google.com/docs/reference/rest/database
// guide: https://firebase.google.com/docs/database/rest/save-data
// blog post on key generation: https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html

router.post('/',
  (req, res, next) => {

    const body = { brand: "Toyota", id: 4, model: "tFake2000", price: "50000" };

    fetch('https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/carmodels.json', {
      method: 'post',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(next());
  },
  (req, res) => {

  }
);


router.post((req, res) => {


})

module.exports = router;
