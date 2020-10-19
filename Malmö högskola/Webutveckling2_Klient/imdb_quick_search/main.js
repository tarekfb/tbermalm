"use strict";

const API_KEY = '5e65d4a0&s';
let listOfFavouriteMovies = [];

//functions to init page
submitFormListener();
showFavouriteMoviesListener();
handlePlaceholderParagraph();
toggleHideFavouriteMovies();
favouriteMoviesHamburgerListener();

function submitFormListener() {
	let form = document.getElementById("search-form");
	let searchBox = document.getElementById("search-box");

	form.addEventListener("submit", function(event) {

		//in this case the user didnt enter any text in the search box
		if (searchBox.value.length === 0){
			searchBox.focus();

			//clear resultContainer to prevent stacking of results/response messages
			let resultContainer = document.getElementById("result-container")
			resultContainer.querySelectorAll('*').forEach(n => n.remove());

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

		//TODO: rewrite to just return the result?
		//then we can choose to display in the appropriate function, since this likely isn't it
	    displayResult(result);
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

	//clear resultContainer to prevent stacking of results/response messages
	let resultContainer = document.getElementById("result-container")
	resultContainer.querySelectorAll('*').forEach(n => n.remove());


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
			//in this case I've passed a single movie, through imdbID
			//instead of a list of results through title
			//checking for null is not a sustainable way of checking if single movie or list
			//TODO: fix

			fetchMovieInfoAndGenerateLiNodes(result);
		} else {
			//in this case the search came through and is a list of movies
			//we display result properties

			//executed for every item in array: Result.Search
			result.Search.forEach(function(entry) {
				fetchMovieInfoAndGenerateLiNodes(entry);
			});
		}

	}

}

function fetchMovieInfoAndGenerateLiNodes(entryFromAJAX) {
	/*
	TODO: rewrite this function:
		after searching by title
		for every item in result.Search
			use the apiHandlerByImdbID function
			get a movie based on imdbID
			then call this method once, passing the single movie
			instead of list

		if so, we can circuvment the awkward "fetchMoreMovieInfo" and just use a single object
		currently using 2: movieInfo, entryFromAJAX
	*/

	/*
	this method takes an entry from forloop, on a list of entries
	which was returned from API call to the OMDb API
	then fetches some information for the entry
	then displays all the entries
	 */

	let resultContainer = document.getElementById("result-container");

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

	fetchMoreMovieInfo(entryFromAJAX.imdbID).then(movieInfo => generateNodesForLi(movieInfo));
	function generateNodesForLi(movieInfo) {

		//this method generates the information for each movie
		//rating, title, actors, etc

		let movieContainer = document.createElement('div');
		movieContainer.id = 'movie-container';
		resultContainer.appendChild(movieContainer);

		//adding hyperlink, the movie's imdb-page, to movie poster
		let a = document.createElement("a");
		let url = "https://www.imdb.com/title/" + entryFromAJAX.imdbID + "/";
		a.href = url;
		movieContainer.appendChild(a);

		let img = document.createElement('img');

		//setting poster src, if poster exists
		if (entryFromAJAX.Poster == "N/A"){
			img.src = "https://www.sunnxt.com/images/placeholders/placeholder_vertical.gif";
		} else {
			img.src = entryFromAJAX.Poster;
		}
		//using this to avoid modal box when clicking the movie poster
		img.id = "movie-poster-anchor";

		a.appendChild(img);

		let text = document.createElement('div');
		text.id = "text";
		movieContainer.appendChild(text);

		let titleYear = document.createElement("span");
		titleYear.id = "title-year";
		titleYear.appendChild(document.createTextNode(entryFromAJAX.Title + " (" + String(entryFromAJAX.Year) + ")"));
		text.appendChild(titleYear);

		let actors = document.createElement("span");
		actors.id = "actors";
		actors.appendChild(document.createTextNode(movieInfo.actors));
		text.appendChild(actors);
		//insert linebreak for styling
		text.insertBefore(document.createElement("br"), actors);

		if (movieInfo.awards == "N/A"){
			movieInfo.awards = "No awards ಠ╭╮ಠ.";
		} else if (movieInfo.awards.length > 25){
			if (screen && screen.width < 1300) {
				movieInfo.awards = "Has won awards nominations."
			}
			//not enough space to show all awards
			//TODO: change to dropdown on touch (jquery?)
			//https://coderwall.com/p/3uwgga/make-css-dropdown-menus-work-on-touch-devices
		}
		let awards = document.createElement("span");
		awards.id = "awards";
		awards.appendChild(document.createTextNode(movieInfo.awards));
		text.appendChild(awards);
		//insert linebreak for styling
		text.insertBefore(document.createElement("br"), awards);

		let ratingDiv = document.createElement('div');
		ratingDiv.id = "rating";
		movieContainer.appendChild(ratingDiv);

		if (movieInfo.rating == "N/A"){
			ratingDiv.style.flexGrow = 0;
			;
		} else {
			ratingDiv.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>';
			let ratingScore = document.createElement("span");
			ratingScore.id = "rating-score";
			ratingScore.appendChild(document.createTextNode(movieInfo.rating));
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
				showModalBox(entryFromAJAX);
			}
		});
	}

}

async function fetchMoreMovieInfo(imdbID) {
	//this is an async function (A promise, right?)
	//allowing us to use await
	//await forces the compiler to wait for the given task to be completed before proceeding
	//(only stops locally, not the entire program)
	//when the fetch as been resolved, the compiler tries to declare an object and give it the return value of res.json();
	//it then returns the imdbRating and the program proceeds as normally

	//however, I have no clue how we circumvent the otherwise needed "open(), send() with the arguments get, omdbURL, true"
	//my guess is that fetch has no requirement for these arguments, but only the appropriate url
	const res = await fetch(`https://www.omdbapi.com/?&apikey=${API_KEY}&s=&i=${imdbID}`);
	const {imdbRating, Actors, Awards} = await res.json();
	const movieInfo = {rating:imdbRating, actors:Actors, awards:Awards};

	return movieInfo;
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
	//TODO: update to work with firebase db
	//if statement of hamburger pulse needs updating
	//and add(pulse-grey-anim)

	if (!document.getElementById("input-hamburger").checked && listOfFavouriteMovies.length == 0){
		document.getElementById("slice1").classList.add("pulse-grey-animation");
		document.getElementById("slice2").classList.add("pulse-grey-animation");
		document.getElementById("slice3").classList.add("pulse-grey-animation");
	}

	let favouriteMoviesUL = document.getElementById("favourite-movies-list");

	// if (document.getElementById("input-hamburger").checked){
	// 	favouriteMoviesUL.lastElementChild.classList.add("pulse-grey-animation");
	// }

	handlePlaceholderParagraph();

	pushFavouriteMovie(entryFromAJAX);
	readFavouriteMoviesList().then(snapshot => populateFavouriteMoviesList(snapshot));

}

function populateFavouriteMoviesList(snapshot) {
	//this function populates the favmovieslist in the sidebar
	//uses a snapshot that was indirectly passed from dataAccessLayer.js
	//specifically, readFavouriteMoviesList()

	snapshot.forEach(function (snapshot){
		let movieObj = snapshot.val();

		let favouriteMoviesUL = document.getElementById("favourite-movies-list");

		let a = document.createElement("a");
		let url = "https://www.imdb.com/title/" + snapshot.key + "/";
		a.href = url;
		favouriteMoviesUL.appendChild(a);

		let li = document.createElement("li");
		li.appendChild(document.createTextNode(movieObj.title + " (" + String(movieObj.year) + ")"));
		a.appendChild(li);

	});
//TODO: make scrollable if too many movies
}

function favouriteMoviesHamburgerListener() {
	//whenever the user opens the sidebar menu with favourite movies
	//this will update list with values from db
	let inputHamburgerCheckbox = document.getElementById("input-hamburger");

	inputHamburgerCheckbox.addEventListener( 'change', function() {
		if (this.checked) {
			readFavouriteMoviesList().then(snapshot => populateFavouriteMoviesList(snapshot));
		}
	});
}

function handlePlaceholderParagraph() {
	let favouriteMoviesUL = document.getElementById("favourite-movies-list");
	let placeholderP = document.getElementById("empty-list-placeholder");
	let showListButton = document.getElementById("show-favourite-movies");

	//TODO: rewrite to work with firebase db
	placeholderP.style.display = "none";

	//if array = 0, show p saying list empty
	// if (favouriteMoviesUL.getElementsByTagName('li').length == 0){
	// 	placeholderP.style.display = "block";
	// 	showListButton.style.display = "none";
	// } else {
	// 	placeholderP.style.display = "none";
	// 	showListButton.style.display = "inline-block";
	//
	// }
}

function showFavouriteMoviesListener() {
	//this function is allows us to resolve the promise given by readFavMovList in dal
	//and pass the snapshot to displayFavMovies

	let showFavouriteMoviesBtn = document.getElementById("show-favourite-movies");
	showFavouriteMoviesBtn.addEventListener("click", function (){
		readFavouriteMoviesList().then(snapshot => displayFavouriteMovies(snapshot));
	});
}

function displayFavouriteMovies(snapshot) {
	//TODO: rewrite to work with firebase db

	//this clears whatever result is previously displayed
	let resultContainer = document.getElementById('result-container');
	resultContainer.innerHTML = "";

	listOfFavouriteMovies.forEach(function(entry) {
		fetchMovieInfoAndGenerateLiNodes(entry);
	});

	snapshot.forEach(function (snapshot) {
		let key = snapshot.key;
		apiHandlerByImdbID(key);
	});

	/*
	what i need to do is:
		for every item in movie-list
			get the imdbID from snapshot/firebase CHECK
			make ajax call with the imdbID
			pass the entryFromAJAX to fetchMovieInfoAndGenerateLiNodes()

	however, it seems i need to break up the functions inside of fetchMovieInfoAndGenerateLiNodes
	because that function presumes i already have an entry with

	im instead creating new fun for imdbidapiahndler
	and using that entry

 */

}

/*
	beneath this point shall all
	'unwanted-but-possibly-useful-down-the-line' lines of code
	be kept
 */

function toggleHideFavouriteMovies() {
	//TODO: delete if fav-movies sidebar is working as intended
	// //trying to make it so the sidebar deosnt cover container div, even when not clicked
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