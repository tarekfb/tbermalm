const express = require('express');
const router = express.Router();
const path = require("path");

// Serving index.html on GET at root
router.get("/", (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, "..", "..", "public", "views", "index.html"));
});

module.exports = router;
