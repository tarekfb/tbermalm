initializeFireBase();
const DATABASE = firebase.database();
const ROOT_REF = DATABASE.ref();
let userRef = null;

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

    initFirebaseUI();
}

function initFirebaseUI() {

    // FirebaseUI config.
    let uiConfig = {
        // signInSuccess: function(currentUser, credential, redirectUrl) {
        //     return false; //this will stop the signinsuccessurl from being used
        //     },
       // signInSuccessUrl: 'https://www.tbdevstuff.live/webutveckling2_klient/imdb_quick_search/imdb_quick_search.html',
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

firebase.auth().onAuthStateChanged(function(firebaseUser) {
    //if the user signs out or in
    //define firebaseUser properties
    //pass firebaseUser to main.js (front end)
    //this fun will also fire when the initial state is determined

    if (firebaseUser) {
        // User is signed in.
        let uid = firebaseUser.uid;

        /* this code isn't used, so commenting out but leaving for future usage
        let displayName = firebaseUser.displayName;
        let email = firebaseUser.email;
        let emailVerified = firebaseUser.emailVerified;
        let photoURL = firebaseUser.photoURL;
        let phoneNumber = firebaseUser.phoneNumber;
        let providerData = firebaseUser.providerData;

        firebaseUser.getIdToken().then(function(accessToken) {
        });
        */

        authStateChanged(firebaseUser);
        readFavouriteMoviesList().then(snapshot => populateFavouriteMoviesList(snapshot));
        handlePlaceholderSpan();
        userRef = ROOT_REF.child(`users/${uid}/`);

    } else {
        // User is signed out.
        authStateChanged(firebaseUser);
    }
}, function(error) {
    console.log(error);
    alert(error);
});

function getFirebaseAuth() {
    return firebase.auth();
}

function checkFirebaseUserState() {
    if (firebase.auth().currentUser) {
        //logged in
        return true;
    } else {
        return false;
    }
}

async function checkIfUserHasChildren() {
    let boolean;
    return readFavouriteMoviesList().then(function (snapshot) {
        if (snapshot.hasChildren()) {
            boolean = true;
            return boolean;
        } else {
            boolean = false;
            return boolean;
        }
    });

}

function pushFavouriteMovie(entryFromAJAX) {
    //what this fun does:
    //  if branch exists
    //      add selected movie
    //  if no branch for currentUser.uid exists
    //    create branch after currentUser.uid, add the selected movie and its title/year/rating

    let uid = firebase.auth().currentUser.uid;
    let newFavouriteMovieRef = ROOT_REF.child("users/" + uid + "/" + entryFromAJAX.imdbID);
    newFavouriteMovieRef.set({
        title: entryFromAJAX.Title,
        year: entryFromAJAX.Year,
        rating: entryFromAJAX.imdbRating
    });

}

async function readFavouriteMoviesList() {
    //this fun reads the current users branch (root/users/uid/)
    //then returns a promise with a snapshot of the movie-list

    let uid = firebase.auth().currentUser.uid;
    let movieListRef = DATABASE.ref(`users/${uid}`);
    return movieListRef.once("value").then(function (snapshot) {
        return snapshot;
    });

}

function deleteFromFavouriteMovies(imdbID) {
   const movieRef = userRef.child(imdbID);
   movieRef.remove();
}

function firebaseSignOut() {
    //this fun is called when user signs out
    //does just that, and nothing else
    firebase.auth().signOut();
    window.location='https://www.tbdevstuff.live/webutveckling2_klient/imdb_quick_search/imdb_quick_search.html';
}