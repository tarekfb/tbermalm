const express = require("express");
const path = require("path");
const fetch = require('node-fetch');
const firebase = require(path.join("./..", "firebase"));


let router = express.Router();
router.use(express.json());

// AJAX requests at root for carmodels
router
  .route("/")
  .get((req, res) => {
    firebase.database().ref("carshop/carmodels/").once("value").then(snapshot => {

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
  })
  .post((req, res) => {
    // We want to restrict the accessibility of deciding certain values
    // The key for children of carmodels is one such value
    // Therefore we handle it here

    // We first want to get the key of the last child for carmodels
    // Then key++
    // This will be the key of the new item
    firebase.database().ref("carshop/carmodels/").orderByKey().limitToLast(1).once("value").then(snapshot => {
      let snapshotObj = snapshot.val();
      let key = Object.keys(snapshotObj)[0];
      key++;

      // Create new item, for the new key
      firebase.database().ref(`carshop/carmodels/${key}`).set(req.body).then(result => {
         res.send(result);
      });

    });

  });
  router.
    route("/:id")
    .get((req, res) => {
      firebase.database().ref(`carshop/carmodels/${req.params.id}`).once("value").then(snapshot => {
        res.send(snapshot);
      });
    })
    .delete(((req, res) => {
      firebase.database().ref(`carshop/carmodels/${req.params.id}`).remove(result => {
        res.send(result);
      });

    }));


// router.post('/',
//   (req, res, next) => {
//
//     const body = { brand: "Toyota", id: 4, model: "tFake2000", price: "50000" };
//
//     fetch('https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/carmodels.json', {
//       method: 'post',
//       body:    JSON.stringify(body),
//       headers: { 'Content-Type': 'application/json' },
//     })
//       .then(res => res.json())
//       .then(next());
//   },
//   (req, res) => {
//
//   }
// );

module.exports = router;
