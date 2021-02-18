const express = require("express");
const path = require("path");
const firebase = require(path.join("./..", "firebase"));
const router = express.Router();
router.use(express.json());

//serve html file
// router
//   .route("/")
//   .get((req, res) => {
//     console.log("here");
//     res.setHeader('Content-Type', 'text/html');
//     res.sendFile(path.join(__dirname, "..", "..", "public", "views", "employees.html"));
//     //middleware next() blog: https://dev.to/getd/express-middleware-is-just-a-fancy-way-of-chaining-a-bunch-of-functions-explained-in-3-mins-43jf
//     //html serving path routing issue: https://stackoverflow.com/questions/35896820/expressjs-router-based-on-content-type-header
//     //something that i dont think is needed: https://www.robinwieruch.de/node-express-server-rest-api
//
//   });

// router
//   .route("/indexemployees", ).get((req, res) => {
//     firebase.database().ref("carshop/employees/").once("value").then(snapshot => {
//       let childDataArray = [];
//       snapshot.forEach(function (childSnapshot) {
//         let childData = childSnapshot.val();
//         childDataArray.push(childData);
//       });
//       res.send(childDataArray);
//     });
//     //remove once proper serving is fixed, just for etsting
//   });

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
    });
  });


module.exports = router;
