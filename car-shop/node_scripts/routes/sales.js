const express = require("express");
const path = require("path");
const fetch = require('node-fetch');

let router = express.Router();
router.use(express.json());

// AJAX requests at root for carmodels
router
  .route("/")
  .get((req, res) => {
    /*
    What this request should return:
    all employees + their respective properties
    As well as an extra property for each emp with their total sales sum

    How to accomplish:
    - foreach employee_id emp, consider each occurance of emp in sales (sales/i) s
      - get carmodel_id c
      - for c, get price p (in carmodels/i/price)
      - let priceSum += p;

    - get employees.json
    - modify json object:
      - search json for emp
      - foreach (emp in employees.json)
        - add key value pair: totalSalesAmount: priceSum
     */

    

  });

module.exports = router;
