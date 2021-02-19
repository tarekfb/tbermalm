const express = require("express");
const path = require("path");
const firebase = require(path.join("./..", "firebase"));
const router = express.Router();
router.use(express.json());

// TODO: change url on both of these middlewares to regex or condition: |
router.use("/login", (req, res, next) => {
  if (firebase.auth().currentUser){
    console.log("already logged in");
    res.sendStatus(403)
  } else {
    console.log("else was called");
    next();
  }
});
router.use("/signup", (req, res, next) => {
  if (firebase.auth().currentUser){
    console.log("already logged in");
    res.sendStatus(403)
  } else {
    console.log("else was called");
    next();
  }
});

router.get("/", (req, res) => {
  if (firebase.auth().currentUser){
    res.send({"result": true});
  } else {
    res.send({"result": false});
  }
});

router
  .route("/signup")
  .post((req, res) => {

    firebase.auth().createUserWithEmailAndPassword(req.body.username, req.body.password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        res.send(200);
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        res.sendStatus(401)
      });

  });

router
  .route("/login")
  .post((req, res) => {
    firebase.auth().signInWithEmailAndPassword(req.body.username, req.body.password)
      .then((userCredential) => {
        // Signed in
        console.log("successful login");
        let user = userCredential.user;
        res.sendStatus(200);

      })
      .catch((error) => {
        console.log("error at login");

        let errorCode = error.code;
        let errorMessage = error.message;
        res.sendStatus(401);
      });
  });

router
  .route("/logout")
  .post((req, res) => {
    firebase.auth().signOut().then(() => {
      console.log("loggedout")

    }).catch((error) => {
      // An error happened.
      console.log("failed logout");
    });
    res.send();
  });

module.exports = router;
