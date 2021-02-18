const express = require('express');
const router = express.Router();
const path = require("path");
const fetch = require("node-fetch");

// Serving index.html on GET at root
// router.get("/", (req, res) => {
//   res.setHeader('Content-Type', 'text/html');
//   res.sendFile(path.join(__dirname, "..", "..", "public", "views", "index.html"));
// });

router.get("/", serveHtml, sendJsonData);

// router.get("/", (req, res) => {
//   res.setHeader('Content-Type', 'text/html');
//   res.sendFile(path.join(__dirname, "..", "..", "public", "views", "index.html"));
// });

function serveHtml(req, res, next) {
  // perform middleware function e.g. check if user is authenticated
  console.log("here html index will be served");
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, "..", "..", "public", "views", "index.html"));
  next();  // move on to the next middleware
}

function sendJsonData(req, res) {
  // perform middleware function e.g. check if user is authenticated
  fetch('https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/employees.json')
    .then(res => res.json())
    .then(json => res.send(json));
  console.log("here JSON will be sent");
  res.end();  // move on to the next middleware
}




module.exports = router;
