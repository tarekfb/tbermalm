const express = require("express");
const path = require("path");
const firebase = require(path.join("./..", "firebase"));
const router = express.Router();
router.use(express.json());

//TODO: make global scope variables for auth() and rootRef

// Middleware to check if user is logged out, and allow if so
// TODO: change url on both of these middlewares to regex or condition: |
router.use("/login", (req, res, next) => {
  if (firebase.auth().currentUser){
    console.log("already logged in");
    res.sendStatus(400)
  } else {
    next();
  }
});
router.use("/signup", (req, res, next) => {
  if (firebase.auth().currentUser){
    console.log("already logged in");
    res.sendStatus(400)
  } else {
    next();
  }
});

// Middleware to check if user is logged in, and allow if so
router.use("/reset-password", (req, res, next) => {
  if (firebase.auth().currentUser){
    next();
  } else {
    res.sendStatus(400)
  }
});


router.get("/", (req, res) => {
  if (firebase.auth().currentUser){
    let user = firebase.auth().currentUser;
    res.send({"result": true, "user": user});
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
        res.status(200);
        res.send(user);
        //res.send(200);
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        res.sendStatus(400)
      });

  });

router
  .route("/login")
  .post((req, res) => {
    firebase.auth().signInWithEmailAndPassword(req.body.username, req.body.password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        res.status(200);
        res.send(user);

      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        res.status(400);
        res.send(error);
      });
  });

router
  .route("/logout")
  .post((req, res) => {
    firebase.auth().signOut().then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      res.status(400);
      res.send(error);
    });
  });

router.get("/reset-password", (req, res) => {
  let auth = firebase.auth();
  let emailAddress = "user@example.com";

  firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email).then(function() {
    res.sendStatus(200);
  }).catch((error) => {
    res.status(400);
    res.send(error);
  });
});

module.exports = router;
