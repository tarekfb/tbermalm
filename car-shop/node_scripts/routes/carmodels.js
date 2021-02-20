const express = require("express");
const path = require("path");
const firebase = require(path.join("./..", "firebase"));

let router = express.Router();
router.use(express.json());

// AJAX requests at root for carmodels
router
  .route("/")
  .get((req, res) => {
    firebase.database().ref("carshop/carmodels/").once("value").then(snapshot => {

      // This structure is necessary because sending the snapshot through GET http call
      // will change hierarchical structure of json
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

      req.body.id = key + 1;

      // Create new item, for the new key
      firebase.database().ref(`carshop/carmodels/${key}`).set(req.body).then(result => {
         res.send(result);
      });

    });
    // TODO: for upgraded functionality, rewrite to using push()
    // This will generate a unique key for each new child
    // It will also help avoid issues when multiple users are adding items simultaneously
    // Can change the key afterwards
    // Although having auto-generated key for every child would be better, specs say 0, 1, 2, etc

  });
  router.
    route("/:id")
    .get((req, res) => {
      firebase.database().ref(`carshop/carmodels/${req.params.id}`).once("value").then(snapshot => {
        res.send(snapshot);
      });
    })
    .delete(((req, res) => {
      // This code deletes on key

      //let root = firebase.database().ref();
      // firebase.database().ref(`carshop/carmodels/${req.params.id}`).remove().then(result => {
      //   res.send(result);
      //   // const twoRef = rootRef.child("users").orderByChild("email").equalTo("alice@email.com");
      // });

      // This code deletes on JSON value of ID key
      firebase.database().ref("carshop/carmodels").orderByChild("id").equalTo(parseInt(req.params.id)).once("value").then(snapshot => {
        console.log(snapshot.val());
        let promises = [];
        snapshot.forEach(child => {
          promises.push(child.ref.remove());
        });
        Promise.all(promises).then(() => res.send(200));
      });
      // TODO: rewrite to only delete the single item in JSON object
      // Foreach not needed, since there will always be just one item with the ID

    }));


module.exports = router;
