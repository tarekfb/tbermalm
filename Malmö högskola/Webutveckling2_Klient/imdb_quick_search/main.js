/* Tarek Bermalm - AK6336. */
"use strict";

const API_KEY = '5e65d4a0&s';
let listOfFavouriteMovies = [];

//functions to init page
submitFormListener();
handlePlaceholderParagraph();
toggleHideFavouriteMovies();

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

			let queryText = form.elements.query.value;
			apiHandler(encodeURI(queryText));

			event.preventDefault();
		}

	});
}

function apiHandler(title) {
	//define api request variables
	const omdbAPI = new XMLHttpRequest();
	const omdbURL = "https://www.omdbapi.com/?&apikey=5e65d4a0&s=" + title;

	//adding listener to request
	omdbAPI.addEventListener("load", function() {
		//saving result
	    let result = JSON.parse(this.responseText);

	    //passing result to function that displays result
	    displayResult(result);
	});

	//executing api request
	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();
}

function fetchMovieInfoAndGenerateLiNodes(entryFromAJAX) {

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
	//generateNodes creates the appriopriate nodes
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

		//in this case the search came through
		//we display result properties

		//executed for every item in array: Result.Search
		result.Search.forEach(function(entry) {
			fetchMovieInfoAndGenerateLiNodes(entry);
		});
	}

}

//this is an async function (A promise, right?)
//allowing us to use await
//await forces the compiler to wait for the given task to be completed before proceeding
//(only stops locally, not the entire program)
//when the fetch as been resolved, the compiler tries to declare an object and give it the return value of res.json();
//it then returns the imdbRating and the program proceeds as normally

//however, I have no clue how we circumvent the otherwise needed "open(), send() with the arguments get, omdbURL, true"
//my guess is that fetch has no need for these arguments, but only the appropriate url
async function fetchMoreMovieInfo(imdbID) {
	const res = await fetch(`https://www.omdbapi.com/?&apikey=${API_KEY}&s=&i=${imdbID}`);
	const {imdbRating, Actors, Awards} = await res.json();
	const movieInfo = {rating:imdbRating, actors:Actors, awards:Awards};
	return movieInfo;
}

//showing the modalbox for saving movies
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

function mainFun(logString) {
	console.log(logString);
}
dalFun("test from mainjs");
console.log("test");

function saveMovieToFavourite(entryFromAJAX) {

	if (!document.getElementById("input-hamburger").checked && listOfFavouriteMovies.length == 0){
		document.getElementById("slice1").classList.add("pulse-grey-animation");
		document.getElementById("slice2").classList.add("pulse-grey-animation");
		document.getElementById("slice3").classList.add("pulse-grey-animation");
	}

	listOfFavouriteMovies.push(entryFromAJAX);
	let favouriteMoviesUL = document.getElementById("favourite-movies-list");
	favouriteMoviesUL.innerHTML = "";

	generateChildrenForFavouriteMoviesUL();

	if (document.getElementById("input-hamburger").checked){
		favouriteMoviesUL.lastElementChild.classList.add("pulse-grey-animation");
	}
	//not working atm

	handlePlaceholderParagraph();
}

function generateChildrenForFavouriteMoviesUL() {

	listOfFavouriteMovies.forEach(function (entry){
		let favouriteMoviesUL = document.getElementById("favourite-movies-list");

		let a = document.createElement("a");
		let url = "https://www.imdb.com/title/" + entry.imdbID + "/";
		a.href = url;
		favouriteMoviesUL.appendChild(a);

		let li = document.createElement("li");
		li.appendChild(document.createTextNode(entry.Title + " (" + String(entry.Year) + ")"));
		a.appendChild(li);
	});

}

function handlePlaceholderParagraph() {
	let favouriteMoviesUL = document.getElementById("favourite-movies-list");
	let placeholderParag = document.getElementById("empty-list-placeholder");
	let showListButton = document.getElementById("show-favourite-movies");

	//if array = 0, show p saying list empty
	if (favouriteMoviesUL.getElementsByTagName('li').length == 0){
		placeholderParag.style.display = "block";
		showListButton.style.display = "none";
	} else {
		placeholderParag.style.display = "none";
		showListButton.style.display = "inline-block";

	}
}

function displayFavouriteMovies() {

	//this method displays the favourites that the user previously have saved

	//clear whatever result is previously displayed
	let resultContainer = document.getElementById('result-container');
	resultContainer.innerHTML = "";

	listOfFavouriteMovies.forEach(function(entry) {
		fetchMovieInfoAndGenerateLiNodes(entry);
	});

}

import {dalFun} from "./dataAccessLayer.js";

/*
	beneath this point shall all
	'unwanted-but-possible-useful-down-the-line' lines of code
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