/* Tarek Bermalm - AK6336. */
"use strict";

let form = document.getElementById("search-form");
form.addEventListener("submit", function(event) {
	//clear containerDiv so previous results dont stick around
	let containerDiv = document.getElementById("result");
	containerDiv.querySelectorAll('*').forEach(n => n.remove());

	let target = event.target || event.srcElement;
	
	let queryText = form.elements.query.value;
	apiHandler(encodeURI(queryText));

	event.preventDefault();
		
});

function apiHandler(title) {
	//define api request variables
	var omdbAPI = new XMLHttpRequest();
	var omdbURL = "https://www.omdbapi.com/?&apikey=5e65d4a0&s=" + title + "&type=movie";

	//adding listener to request
	omdbAPI.addEventListener("load", function() {
	    let result = JSON.parse(this.responseText);

	    if (result.Response == "False"){
	    	//in this case something went wrong with the search, details are logged through result.Error
	    	addListItem(result.Error, null);
	    } else if (result.Response == "True") {
	    	//in this case the search came through, and we display Title, year, imdbrating
	    	//also wrap it in a link to IMDB page
	    	result.Search.forEach(function(entry) {
  				addListItem(entry.Title + " (" + String(entry.Year) + ")" + ", " + String(entry.imdbRating), entry.imdbID);
  				console.log(String(entry.imdbRating) + String(result.imdbRating) + "THIS IS RATING" + " " + entry.Year);
			});
	    	//currently does nothing, becuase function isnt fleshed out
			sortListByRating(result);
	    }
	});

	//executing api request
	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();
}

function addListItem(string, imdbID) {
	//just generating nodes as neccessary, to display results
	if (imdbID == null){
		if (string == "Too many results."){
			string += " Try to be more specific."
		} else if (string == "Movie not found!"){
			string += " Did you misspell something?";
		}
		let p = document.createElement("p");
		p.appendChild(document.createTextNode(string));

		let containerDiv = document.getElementById("result")
		containerDiv.appendChild(p);

	} else if (imdbID != null){
	    let a = document.createElement('a');  
	    let link = document.createTextNode(string);
	    a.appendChild(link);

	    let url = "https://www.imdb.com/title/" + imdbID + "/";
	    a.href = url;

		let li = document.createElement("li");
		li.appendChild(a);

		let ul = document.createElement("ul");
		ul.id = "items";
		ul.appendChild(li);

		let containerDiv = document.getElementById("result");
		containerDiv.appendChild(ul);
	}

}

function sortListByRating(resultList) {
//For each li;
// Get imdbid
// Api call for imdbid //returns a movie
// Get imdbrating for movie
// Parseint(imdbrating
// Let rating //Save in variable?
 
//Compare rating with something
//Sort resultList according to this

//need to read and understand sorting
//then use imdbRating for sorting

	resultList.Search.forEach(function(entry) {
  		let omdbAPI = new XMLHttpRequest();
		let omdbURL = "https://www.omdbapi.com/?&apikey=5e65d4a0&s=&i=" + entry.imdbID;

		omdbAPI.addEventListener("load", function() {
			let result = JSON.parse(this.responseText);
			let imdbRating = parseInt(result.imdbRating);
			console.log("ImdbRating is: " + imdbRating);
		});
		omdbAPI.open("get", omdbURL, true);
		omdbAPI.send();
	});
	
}