const express = require("express");
const path = require("path");
const router = express.Router();
router.use(express.json());


router
  .route("/employees")
  .get((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "employees.html"));
  });

router
  .route("/carmodels")
  .get((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "carmodels.html"));
  });

router
  .route("/sales")
  .get((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "sales.html"));
  });

module.exports = router;
