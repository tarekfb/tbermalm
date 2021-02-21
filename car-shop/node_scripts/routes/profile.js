const express = require("express");
const path = require("path");
const firebase = require(path.join("./..", "firebase"));
const router = express.Router();
router.use(express.json());

//TODO: make global scope variables for auth() and rootRef

// Middleware to check if user is logged out, and allow if so
router.use("/signup", (req, res, next) => {
  if (firebase.auth().currentUser){
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
    let authUser = firebase.auth().currentUser;
    firebase.database().ref("carshop/users").orderByChild(authUser.uid).once("value").then(snapshot => {
      for(let i in snapshot.val()){
        res.send({"result": true, "user": snapshot.val()[i]});
      }
    });
  } else {
    res.send({"result": false});
  }
});

router
  .route("/signup")
  .post((req, res) => {

    firebase.auth().createUserWithEmailAndPassword(req.body.username, req.body.password).then((userCredential) => {
      let user = userCredential.user;
      let userProfile = {
        uid: user.uid,
        name: null,
        email: user.email,
        employee_id: null
      };
      return userProfile
    }).then(userProfile => {
      // Create a child in db at users, attaching the relevant information
      // This information can then be used at profile page
      // Every firebase user has a unique UID, which is attached as well
      firebase.database().ref("carshop/users").push(userProfile);
      res.status(200);
      res.send(userProfile);
    }).catch((error) => {
      res.status(400);
      res.send(JSON.stringify(error.message));
    });
  });

router
  .route("/login")
  .post((req, res, next) => {
      firebase.auth().signInWithEmailAndPassword(req.body.username, req.body.password).then((userCredential) => {
        res.locals.user = userCredential.user;
        next();
      }).catch((error) => {
        res.status(401);
        res.send(JSON.stringify(error.message));
      })
  },(req, res) => {
      firebase.database().ref("carshop/users").orderByChild("uid").equalTo(res.locals.user.uid).once("value").then(snapshot => {
        // In this code we are returning the user profile to the client
        // If the program reached this point, there will be exactly 1 user with the UID (not 0, because the login was successful)
        for(let index in snapshot.val()){
          res.status(200);
          res.send(snapshot.val()[index]);
        }
      }).catch((error) => {
        res.status(400);
        res.send(JSON.stringify(error.message));
      })
    });

router
  .route("/logout")
  .post((req, res) => {
    firebase.auth().signOut().then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      res.status(400);
      res.send(JSON.stringify(error.message));
    });
  });

router.get("/reset-password", (req, res) => {
  firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email).then(function() {
    res.sendStatus(200);
  }).catch((error) => {
    res.status(400);
    res.send(JSON.stringify(error.message));
  });
});

router.post("/set-employee-id", (req, res) => {

  async function getUserInfo() {
    let snapshot = await firebase.database().ref("carshop/employees").orderByChild("id").equalTo(parseInt(req.body.id)).once("value");
    for(let i in snapshot.val()) {
        return (snapshot.val()[i]);
      }
  }

  getUserInfo().then(userInfo => {
    firebase.database().ref("carshop/users").orderByChild("email").equalTo(req.body.email).once("value").then(snapshot => {
      snapshot.forEach((child) => {
        child.ref.update(userInfo);
      });
      res.status(200);
      res.send(userInfo);
    }).catch((error) => {
        res.status(400);
        res.send(JSON.stringify(error.message));
    });
  });

});

router.get("/sales-for-employee/:employee-id", ((req, res) => {
  console.log(req.params.id);

  res.sendStatus(200);
  //res.sendStatus(200);

}));

router.post("/sales-for-employee", (req, res) => {
  firebase.database().ref(`carshop/sales/`).orderByChild("employee_id").equalTo(parseInt(req.body.id)).once("value").then(result => {
    let allSales = [];

    for(let i in result.val()){
      let jsonSale = {
        carmodel_id: result.val()[i].carmodel_id,
        sale_id: result.val()[i].id
      };
      allSales.push(jsonSale);
    }

    res.send(allSales);

  }).catch((error) => {
    res.status(400);
    res.send(JSON.stringify(error.message));
  });
});

module.exports = router;
