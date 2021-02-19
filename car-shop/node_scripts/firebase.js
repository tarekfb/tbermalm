const firebase = require("firebase");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig = {
  apiKey: "AIzaSyA3CVPHJyyjorfnFwb57CVXTg1TL4mM4yc",
  authDomain: "carshop-4c88f.firebaseapp.com",
  databaseURL: "https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "carshop-4c88f",
  storageBucket: "carshop-4c88f.appspot.com",
  messagingSenderId: "746644522987",
  appId: "1:746644522987:web:dfbcc702e8856e32023bae",
  measurementId: "G-6SD4E8Q56C"
};

const app = firebase.initializeApp(firebaseConfig);

module.exports = app;

