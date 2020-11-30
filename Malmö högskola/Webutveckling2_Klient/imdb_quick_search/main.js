"use strict";

const API_KEY = '5e65d4a0&s';

//functions to init page
submitFormListener();
showFavouriteMoviesListener();
favouriteMoviesHamburgerListener();
favouriteMoviesIconListener();
toggleHideFavouriteMovies();


function submitFormListener() {
	let form = document.getElementById("search-form");
	let searchBox = document.getElementById("search-box");

	form.addEventListener("submit", function(event) {

		//clear resultContainer to prevent stacking of results/response messages
		let resultContainer = document.getElementById("result-container")
		resultContainer.querySelectorAll('*').forEach(n => n.remove());

		//in this case the user didnt enter any text in the search box
		if (searchBox.value.length === 0){
			searchBox.focus();

			//generate p saying to enter some text
			let p = document.createElement("p");
			p.appendChild(document.createTextNode("Please type something first."));
			resultContainer.appendChild(p);

			event.preventDefault();
		} else {

			//pass whatever the user entered into the search box as a query to the apiHandler
			let queryText = form.elements.query.value;
			apiHandlerByTitle(encodeURI(queryText));

			event.preventDefault();
		}
	});
}

function apiHandlerByTitle(queryText) {
	//this function queries the omdbAPI by title

	//define api request variables
	const omdbAPI = new XMLHttpRequest();
	const omdbURL = `https://www.omdbapi.com/?&apikey=${API_KEY}&s=` + queryText;

	//adding listener to request
	omdbAPI.addEventListener("load", function() {
		//saving result
		let result = JSON.parse(this.responseText);

		if (result.Response == "False"){
			//in this case the search was unsuccessful
			displayResult(result);
		} else if (result.Response == "True"){
			/*
			in this case the search was successful
			we iterate through all the results
			in-order to fetch a movie based on imdbid
			which contains more information than based on title
			such as actors, cast, poster, awards
			*/

			result.Search.forEach(function (entry){
				apiHandlerByImdbID(entry.imdbID);
			});
		}
	});

	//executing api request
	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();

}
function apiHandlerByImdbID(imdbID) {
	//this function queries the omdbAPI by imdbID

	//define api request variables
	const omdbAPI = new XMLHttpRequest();
	const omdbURL = `https://www.omdbapi.com/?&apikey=${API_KEY}&s=&i=${imdbID}`;

	//adding listener to request
	omdbAPI.addEventListener("load", function() {
		//saving result
		let result = JSON.parse(this.responseText);
		displayResult(result);
	});

	//executing api request
	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();
}

function displayResult(result) {
	if (/Mobi|Android/i.test(navigator.userAgent) && document.getElementById("input-hamburger").checked) {
		document.getElementById("input-hamburger").checked = false;
	}

	 let resultContainer = document.getElementById("result-container")

	//in this case something went wrong with the search
	//this is communicated through p outputting string result.Error
	if (result.Response == "False"){
		let resultString = String(result.Error);

		if (resultString == "Too many results."){
			resultString += " Try to be more specific."
		} else if (resultString == "Movie not found!"){
			resultString += " Did you misspell something?";
		}

		//generate p with resultString
		let p = document.createElement("p");
		p.appendChild(document.createTextNode(resultString));
		resultContainer.appendChild(p);
	} else if (result.Response == "True"){
		if (result.Search == null){
			//in this case a single movie is passed, through apiHandlerByImdbID
			//instead of a list of results, through apiHandlerByTitle
			//checking for null is not a sustainable way of checking if single movie or list
			//TODO: implement a more accurate condition

			generateMovieCard(result);
		} else {
			//in this case the search came through and is a list of movies
			//we display result properties

			//executed for every item in array: Result.Search
			result.Search.forEach(function(entry) {
				generateMovieCard(entry);
			});
		}
	}

}

function generateMovieCard(apiCallResult) {

	/*
	this function takes the result of a imdbID query
	which was returned from API call to the OMDb API
	then generates a movie card
	*/

	let resultContainer = document.getElementById("result-container");

	let movieContainer = document.createElement('div');
	movieContainer.id = 'movie-container'; //TODO: fix. this assigning a unique ID to many divs. shouldnt be possible
	movieContainer.style.zIndex = "-1"; //this fixes the movie card being infront of sidebar menu
	resultContainer.appendChild(movieContainer);

	//adding hyperlink, the movie's imdb-page, to movie poster
	let a = document.createElement("a");
	let url = "https://www.imdb.com/title/" + apiCallResult.imdbID + "/";
	a.href = url;
	movieContainer.appendChild(a);

	let img = document.createElement('img');

	//setting poster src, if poster exists
	if (apiCallResult.Poster == "N/A"){
		img.src = "https://www.sunnxt.com/images/placeholders/placeholder_vertical.gif";
	} else {
		img.src = apiCallResult.Poster;
	}
	//using this to avoid modal box when clicking the movie poster
	img.id = "movie-poster-anchor";

	a.appendChild(img);

	let text = document.createElement('div');
	text.id = "text";
	movieContainer.appendChild(text);

	let titleYear = document.createElement("span");
	titleYear.id = "title-year";
	titleYear.appendChild(document.createTextNode(apiCallResult.Title + " (" + String(apiCallResult.Year) + ")"));
	text.appendChild(titleYear);

	let actors = document.createElement("span");
	actors.id = "actors";
	actors.appendChild(document.createTextNode(apiCallResult.Actors));
	text.appendChild(actors);
	//insert linebreak for styling
	text.insertBefore(document.createElement("br"), actors);

	if (apiCallResult.Awards == "N/A"){
		apiCallResult.Awards = "No awards.";
	} else if (apiCallResult.Awards.length > 25){
		if (screen && screen.width < 1300) {
			apiCallResult.Awards = "Has won awards or nominations."
		}
		//not enough space to show all awards
		//TODO: change to dropdown on touch (jquery?)
		//https://coderwall.com/p/3uwgga/make-css-dropdown-menus-work-on-touch-devices
	}
	let awards = document.createElement("span");
	awards.id = "awards";
	awards.appendChild(document.createTextNode(apiCallResult.Awards));
	text.appendChild(awards);
	//insert linebreak for styling
	text.insertBefore(document.createElement("br"), awards);

	let ratingDiv = document.createElement('div');
	ratingDiv.id = "rating";
	movieContainer.appendChild(ratingDiv);

	if (apiCallResult.imdbRating == "N/A"){
		ratingDiv.style.display = "none";
	} else {
		ratingDiv.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>';
		let ratingScore = document.createElement("span");
		ratingScore.id = "rating-score";
		ratingScore.appendChild(document.createTextNode(apiCallResult.imdbRating));
		ratingDiv.appendChild(ratingScore);
	}

	let ratingMax = document.createElement("span");
	ratingMax.id = "rating-max";
	ratingMax.appendChild(document.createTextNode("/10"));
	ratingDiv.appendChild(ratingMax);

	movieContainer.addEventListener("click", function (event){
		if (event.target.id == "movie-poster-anchor"){
			//do nothing
			//since we just want to avoid showing modalbox in this case
		} else {
			showModalBox(apiCallResult);
		}
	});


	//TODO: wip
	//what I want to do is make sure the height of the sidebar menu matches the page height
	//this is one of the times where page height is changed
	//which means i can use tihs to test:
	//the page height get increased by each movie card
	//then match height of sidebar to parent (#container)
	//do this for each card. but doesn't work atm.
	//might be because sidebar div is absolute, so the background-color doesn't render where there is no content

	let favouriteMovieContainer = document.getElementById('favourite-movies-container')
	favouriteMovieContainer.style.height = favouriteMovieContainer.parentNode.offsetHeight+"px";
	// console.log("parentnode: " + favouriteMovieContainer.parentNode);
	// console.log("page heigt: " + favouriteMovieContainer.parentNode.offsetHeight);
	// console.log("sidebar heigt: " + favouriteMovieContainer.offsetHeight);


	/*
	when I wrote this function I initially had some really awkward design
	it was my first usage of async functions
	i tried to explain (to myself) async functions and promises through comments here and there
	leaving all comments below
	*/

	//handling sync is quite awkward at the moment
	//first usage of promise and async
	//found some fetch magic online
	//will try to document for my own sake

	//im running the async fun fetchMoreMovieInfo (a thenable promise)
	//which returns a rating after the request comes through
	//when the fetch has been resolved it moves to .then
	//.then has a callback (function, object) attached to it
	//generateNodes creates the appropriate nodes
	//the items are displayed and task is complete

	//this method generates the design for each movie card
	//rating, title, actors, etc

	/*
	this comment below from a different (async) function, where I made another apicall by imdbID
	i also used this result, so in effect i had two results from two api calls that could've been done with one
	*/

	//this is an async function (A promise, right?)
	//allowing us to use await
	//await forces the compiler to wait for the given task to be completed before proceeding
	//(only stops locally, not the entire program)
	//when the fetch as been resolved, the compiler tries to declare an object and give it the return value of res.json();
	//it then returns the imdbRating and the program proceeds as normally

}

//showing the modal box for saving movies
function showModalBox(entryFromAJAX) {
	let span = document.getElementsByClassName("close")[0];
	let cancel = document.getElementById("cancel");
	let save = document.getElementById("save");
	let modal = document.getElementById("modal-box")

	modal.style.display = "block";

	span.onclick = function() {
		modal.style.display = "none";
	}
	cancel.onclick = function (){
		modal.style.display = "none";
	}
	window.onclick = function(event){
		if (event.target == modal){
			modal.style.display = "none";
		}
	}
	save.onclick = function (){
		modal.style.display = "none";
		saveMovieToFavourite(entryFromAJAX);
	}

}

function saveMovieToFavourite(entryFromAJAX) {
	//TODO: update to work with firebase db, see below
	//if statement of hamburger pulse needs updating
	//and add(pulse-grey-anim)

	let favouriteMoviesUL = document.getElementById("favourite-movies-list");

	if (!document.getElementById("input-hamburger").checked && favouriteMoviesUL.childElementCount == 0){
		document.getElementById("slice1").classList.add("pulse-grey-animation");
		document.getElementById("slice2").classList.add("pulse-grey-animation");
		document.getElementById("slice3").classList.add("pulse-grey-animation");
	}

	if (document.getElementById("input-hamburger").checked){
		//favouriteMoviesUL.lastElementChild.classList.add("pulse-grey-animation");
	}

	handlePlaceholderParagraph();

	pushFavouriteMovie(entryFromAJAX);
	readFavouriteMoviesList().then(snapshot => populateFavouriteMoviesList(snapshot));
}

function populateFavouriteMoviesList(snapshot) {
	// this function populates the favmovieslist in the sidebar
	// it takes a snapshot of the current user's branch that was passed from readFavouriteMoviesList() in dataAccessLayer.js
	// it then creates the html elements

	let favouriteMoviesUL = document.getElementById("favourite-movies-list");
	favouriteMoviesUL.querySelectorAll('*').forEach(n => n.remove());

	snapshot.forEach(function (snapshot){

		let movieObj = snapshot.val();

		let li = document.createElement("li");
		li.id = 'favourite-movie-li';
		favouriteMoviesUL.appendChild(li);

		let a = document.createElement("a");
		let url = "https://www.imdb.com/title/" + snapshot.key + "/";
		a.href = url;
		a.classList.add("favourite-movie-anchor");
		li.appendChild(a);

		a.appendChild(document.createTextNode(
			movieObj.title + " (" + movieObj.year + ")"
		));

		//this span displays rating-star and rating
		let ratingSpan = document.createElement("span");
		ratingSpan.innerHTML = "<i class=\"fa fa-star\" aria-hidden=\"true\"></i>";
		ratingSpan.appendChild(document.createTextNode(" " + movieObj.rating));

		a.appendChild(ratingSpan);

		let deleteSpan = document.createElement("span");
		deleteSpan.innerHTML = "<i class=\"fas fa-trash\"></i>";
		li.appendChild(deleteSpan);

		//li.innerHTML = li.innerHTML + "<i class=\"fas fa-trash\"></i>";
		//placed this here to allow using white-space: nowrap; on the entire span

		//a.appendChild(li);

	});
//TODO: make scrollable if too many movies
}

function favouriteMoviesHamburgerListener() {
	//whenever the user opens the sidebar menu with favourite movies
	//this will update list with values from db
	//necessary to call every time because -->
	// --> user could've added favourites while closed
	let inputHamburgerCheckbox = document.getElementById("input-hamburger");

	inputHamburgerCheckbox.addEventListener( 'change', function() {
		if (this.checked) {
			if (!checkFirebaseUserState){
				readFavouriteMoviesList().then(snapshot => populateFavouriteMoviesList(snapshot));
			}
		}
	});
}

function handlePlaceholderParagraph() {
	//this fun checks if the user has added any movies yet
	//if the list of fav movies is empty -->
	// --> display p saying 'try adding movies'

	let favouriteMoviesUL = document.getElementById("favourite-movies-list");
	let placeholderP = document.getElementById("empty-list-placeholder");
	let showListButton = document.getElementById("show-favourite-movies");

	placeholderP.style.display = "none";
	readFavouriteMoviesList().then(function (snapshot){
		if (!snapshot.hasChildren()){
			placeholderP.style.display = "block";
			showListButton.style.display = "none";
			favouriteMoviesUL.style.display = "none";
		} else {
			placeholderP.style.display = "none";
			showListButton.style.display = "inline-block";
			favouriteMoviesUL.style.display = "unset";
		}
	});

}

function favouriteMoviesIconListener() {
	let editFavouriteMovies = document.getElementById("edit-favourite-movies-icon");
	editFavouriteMovies.addEventListener("click", editOrConfirmStateChange);

	//this code forces the 'edit' icon on page reload
	//the sessionStorage will expire on each page reload
	editFavouriteMovies.classList.remove("confirm-favourite-movies");
	sessionStorage.setItem("notEditing", "true");

	//localStorage does NOT expire on page reload
	//this could just as well be implemented as:
	//	window.onload = fun{notEditing.classlist.remove "confirm-fav-m"};
	//but im here to learn, so this stays
	window.onload = function() {
		let notEditing = localStorage.getItem('notEditing');
		if (notEditing === 'true'){
			editFavouriteMovies.classList.remove("confirm-favourite-movies");
		}
	}
}

function editOrConfirmStateChange() {
	//this fun changes whether the user is currently editing their favouriteMovieList -->
	// --> or if they already confirmed edits
	//we toggle a class that changes the icon to "check"
	//when the icon is pressed, it'll display or hide the trashcan icon

	let editFavouriteMovies = document.getElementById("edit-favourite-movies-icon");
	editFavouriteMovies.classList.toggle("confirm-favourite-movies");

	let favouriteMoviesUL = document.getElementById("favourite-movies-list");
	let trashList = favouriteMoviesUL.querySelectorAll(".fas.fa-trash"); //should search for favourite-movie-anchor
	let trashArray = [...trashList];
	//spread operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax

	trashArray.forEach(trash => {
		trash.addEventListener("click", deleteFromFavouriteMovies);
		//trash.classList.toggle("hide"); 	//toggle doesnt work for some reason

		console.log(trash.style.display == "none"); //this logs as false, when it is true. WHats going on?

		//resorting to manually toggling
		if (trash.style.display == "none"){
			trash.style.display = "inline-block";
		} else if (trash.style.display = "inline-block"){
			trash.style.display = "none";
		}
	});

}


function deleteFromFavouriteMovies() {
	//this fun will
	console.log("delete WIP");
}

function showFavouriteMoviesListener() {
	//this function allows us to resolve the promise given by readFavMovList in dal
	//and pass the snapshot to displayFavMovies

	let showFavouriteMoviesBtn = document.getElementById("show-favourite-movies");
	showFavouriteMoviesBtn.addEventListener("click", function (){
		readFavouriteMoviesList().then(snapshot => displayFavouriteMovies(snapshot));
	});
}

function displayFavouriteMovies(snapshot) {
	//this fun takes the movies that the user saved to favourites -->
	// --> and displays them in the main result container

	//this clears whatever result is previously displayed
	let resultContainer = document.getElementById('result-container');
	resultContainer.innerHTML = "";

	//this generates a list of movies in the main result container, based on imdbID
	snapshot.forEach(function (snapshot) {
		let key = snapshot.key;
		apiHandlerByImdbID(key);
	});

}

function authStateChanged(firebaseUser) {
	//this fun is called when the fireBase user changes state (sign in or out)
	//a fun in DAL is called at that point
	//that fun calls this fun and passes either the firebaseUser
	//the firebaseUser has properties on SIGN IN
	//the firebaseUser is null on LOG OFF

	let firebaseUISignupContainer = document.getElementById("firebaseui-signup-container");
	let signInStatus = document.getElementById('sign-in-status');
	let signOut =  document.getElementById('sign-out');
	let titleAndListContainer =  document.getElementById("title-and-list-container");

	if (firebaseUser){
		firebaseUISignupContainer.style.display = "none";
		signOut.textContent = 'Log out';
		signOut.onclick = firebaseSignOut;
		signOut.style.display = "unset";
		titleAndListContainer.style.display = "unset";

		if (firebaseUser.displayName == null){
			signInStatus.textContent = 'Welcome, Guest';
		} else{
			signInStatus.textContent = 'Welcome, ' + firebaseUser.displayName;
		}
		signInStatus.style.display = "unset";

	} else {
		firebaseUISignupContainer.style.display = "unset";
		signInStatus.textContent = 'Signed out';
		signInStatus.style.display = "none";
		signOut.style.display = "none";
		titleAndListContainer.style.display = "none";
	}
}

/*
	beneath this point shall all
	'unwanted-but-possibly-useful-down-the-line' lines of code
	be kept
 */

function toggleHideFavouriteMovies() {
	//TODO: delete if fav-movies sidebar is working as intended
	// //trying to make it so the sidebar doesn't cover container div, even when not clicked
	// let inputToggleFavouriteMovies = document.getElementById("input-hamburger");
	// let favouriteMoviesContainer = document.getElementById("favourite-movies-container");
	//
	// if (inputToggleFavouriteMovies.checked){
	// 	favouriteMoviesContainer.style.zIndex = "95";
	// } else {
	// 	document.getElementById("container").style.zIndex = "5";
	// 	favouriteMoviesContainer.style.zIndex = "1";
	// 	// i think it odesnt work bcus body is covering input
	// }
	//
	// document.getElementById("slice1").style.zIndex = "-5";
	// document.getElementById("slice2").style.zIndex = "-5";
	// document.getElementById("slice3").style.zIndex = "-5";
	//
	// inputToggleFavouriteMovies.style.zIndex = "15010";

	// if (inputToggleFavouriteMovies.checked){
	// 	document.getElementById('favourite-movies-container').style.display = "block";
	// 	document.getElementById("search-box").style.backgroundColor = "blue";
	// } else {
	// 	document.getElementById('favourite-movies-container').style.display = "none";
	// 	document.getElementById("search-box").style.backgroundColor = "white";
	// }
	//if i can make the span and input be positioned outside out of the div
	//i can hide the container of fav movs on click
	//and use the flexbox pattern

}

//is this code for smartphone usage?
// document.getElementById("movie-container").addEventListener("touchstart", touchHandler, false);
// document.getElementById("movie-container").addEventListener("touchmove", touchHandler, false);
// document.getElementById("movie-container").addEventListener("touchend", touchHandler, false);
// function touchHandler(e) {
// 	if (e.type == "touchstart") {
// 		alert("You touched the screen!");
// 	} else if (e.type == "touchmove") {
// 		alert("You moved your finger!");
// 	} else if (e.type == "touchend" || e.type == "touchcancel") {
// 		alert("You removed your finger from the screen!");
// 	}
// }

/*
todo: implement sorting method according to recency
todo: implement browsing pages back and forward
todo: make big "succesfull" checkbox after adding to list
 */

/*leaving some notes from programming diary

Event-driven languages, and callbacks
Imdb ratings lookup tool
16/06/2020

Bumped into an issue when creating my imdb rating lookup tool. 
Javascript is apparently an event-driven language, which means the compiler doesn't wait for responses when executing code, but instead continues with the next operation.
This can be tricky, when you want to wait for a function to finish executing, for example in-order to update a variable value. 
In my case my return statement returns the initial variable declaration, 0, instead of the updated value. 
Because the value, updated by an event listener, has been updated after the return statement is executed.
*/