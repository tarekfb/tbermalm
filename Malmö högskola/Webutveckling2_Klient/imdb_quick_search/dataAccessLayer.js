initializeFireBase();

let db = firebase.database();
let rootRef = db.ref();
firebaseUI();


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


function firebaseUI() {
    //https://github.com/firebase/firebaseui-web/blob/master/README.md#demo
    //https://stackoverflow.com/questions/43756899/how-to-login-a-user-using-firebase-authentication
    //LOOK AT THIS FOR HANDLING BRANCHES AND USERS

    // FirebaseUI config.
    let uiConfig = {
        signInSuccessUrl: 'http://localhost:63342/imdb_quick_search/imdb_quick_search.html', //https://www.tbdevstuff.live/webutveckling2_klient/imdb_quick_search/imdb_quick_search.html
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
            window.location.assign('<your-privacy-policy-url>');
        }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.

    ui.start('#firebaseui-signup-container', uiConfig);

}

firebase.auth().onAuthStateChanged(function(user) {

    let firebaseUISignupContainer = document.getElementById("firebaseui-signup-container");
    let signInStatus = document.getElementById('sign-in-status');
    let signOut =  document.getElementById('sign-out');
   // let signInForm =  document.getElementById("sign-in-form");
    let titleAndListContainer =  document.getElementById("title-and-list-container");

    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        user.getIdToken().then(function(accessToken) {
            // firebaseUISignupContainer.style.display = "unset";
            signInStatus.textContent = 'Signed in: ' + displayName;
            signInStatus.style.display = "unset";
            signOut.textContent = 'Sign out';
            signOut.onclick = firebaseSignOut;
           // signInForm.style.display = "none";
            titleAndListContainer.style.display = "unset";
            firebaseUISignupContainer.style.display = "none";
        });

    } else {
        //User is signed out.
        signInStatus.textContent = 'Signed out';
        signInStatus.style.display = "none";

        signOut.style.display = "none";

        //signInForm.style.display = "unset";
        titleAndListContainer.style.display = "none";
        firebaseUISignupContainer.style.display = "unset";
    }
}, function(error) {
    console.log(error);
});

function firebaseSignIn() {
    // event.preventDefault();
    //
    // let email = document.getElementById("email").value;
    // let password = document.getElementById("password").value;
    //
    // firebase.auth().signInWithEmailAndPassword(email, password)
    //     .catch((error) => {
    //         console.log("Error code: " + error.code + "\n Error message: " + error.message);
    //     });
}

function firebaseSignOut() {
    firebase.auth().signOut();
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