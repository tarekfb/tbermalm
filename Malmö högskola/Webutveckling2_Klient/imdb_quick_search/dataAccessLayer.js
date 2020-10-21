initializeFireBase();

let db = firebase.database();
let rootRef = db.ref();

function initializeFireBase() {
    // The Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    let firebaseConfig = {
        apiKey: "AIzaSyDNoxennmAjR3Yjh9Rpe4ahpHv0zYcdO9Y",
        authDomain: "simple-imdb-search.firebaseapp.com",
        databaseURL: "https://simple-imdb-search.firebaseio.com",
        projectId: "simple-imdb-search",
        storageBucket: "simple-imdb-search.appspot.com",
        messagingSenderId: "875771108342",
        appId: "1:875771108342:web:63ed0e9505a5ac087b45d7",
        measurementId: "G-NZGQ93J58S"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
}

function pushFavouriteMovie(entryFromAJAX) {

    let newFavouriteMovieRef = rootRef.child("movie-list/" + entryFromAJAX.imdbID);
    newFavouriteMovieRef.set({
        title: entryFromAJAX.Title,
        year: entryFromAJAX.Year,
        rating: entryFromAJAX.imdbRating
        //rating: entryFromAJAX.imdbRating

        //currently the imdbRating is fetched from a different object
        //not the one that is passed to this method
        //either have to look at restructuring the AJAX
        //or pass the rating in some very awkward way from main.js
    });
}

async function readFavouriteMoviesList() {
    //this async fun returns a promise with a snapshot of the movie-list

    let movieListRef = db.ref("movie-list");
    return movieListRef.once("value").then(function (snapshot) {
        return snapshot;
    });

}

function handleSignIn() {
    //anon sign in
    //https://firebase.google.com/docs/auth/web/anonymous-auth?authuser=0

    //get started with firebase security
    //https://firebase.google.com/docs/database/security/get-started?authuser=0

  /*
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

   firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    // ...
  } else {
    // User is signed out.
    // ...
  }
  // ...
});

   */
}