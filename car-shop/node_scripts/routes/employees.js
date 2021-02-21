const express = require("express");
const path = require("path");
const firebase = require(path.join("./..", "firebase"));
const router = express.Router();
router.use(express.json());

// AJAX requests at root for employees
router
  .route("/")
  .get((req, res) => {
    firebase.database().ref("carshop/employees/").once("value").then(snapshot => {

      // This structure is necessary because sending the snapshot through GET http call
      // will change structure of json
      // unable to perform this operation in frontend
      // so we rebuild to array with children here
      // and pass to frontend

      let childDataArray = [];
      snapshot.forEach(function (childSnapshot) {
        let childData = childSnapshot.val();
        childDataArray.push(childData);
      });
      res.send(childDataArray);
    }).catch((error) => {
      res.status(400);
      res.send(JSON.stringify(error.message));
    });
  });


module.exports = router;
