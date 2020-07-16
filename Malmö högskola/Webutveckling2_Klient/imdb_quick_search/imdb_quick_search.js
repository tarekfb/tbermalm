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
	    addListItem(result);
	});

	//executing api request
	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();
}

function addListItem(result) {
	if (result.Response == "False"){
		let resultString = String(result.Error);

		if (resultString == "Too many results."){
			resultString += " Try to be more specific."
		} else if (resultString == "Movie not found!"){
			resultString += " Did you misspell something?";
		}
	
		let p = document.createElement("p");
		p.appendChild(document.createTextNode(resultString));

		let resultContainer = document.getElementById("result")
		resultContainer.appendChild(p);
	} else if (result.Response == "True"){
		let ul = document.createElement("ul");
		ul.id = "items";

		let resultContainer = document.getElementById("result");
		resultContainer.appendChild(ul);

		result.Search.forEach(function(entry) {
			let entryString = entry.Title + " (" + String(entry.Year) + ")";
	  		let a = document.createElement('a');  
		    let link = document.createTextNode(entryString); //string goes in ()
		    a.appendChild(link);

		    let url = "https://www.imdb.com/title/" + entry.imdbID + "/";
		    a.href = url;

			let li = document.createElement("li");
			li.appendChild(a);

			ul.appendChild(li);
		});
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