/* Tarek Bermalm - AK6336. */
"use strict";

let form = document.getElementById("search-form");
form.addEventListener("submit", function(event) {
	removeallChildNodes(document.getElementById("items"));
	let target = event.target || event.srcElement;

	console.log(document.getElementById("text-box"));
	console.log(determineIfEmpty(document.getElementById("text-box")));
	if (determineIfEmpty(document.getElementById("text-box"))){
		console.log("true, tdligen");
	} else {
		console.log("false, tdligen");
	}


	
	let queryText = form.elements.query.value;
	apiHandler(encodeURI(queryText));

	event.preventDefault();
		
});

function apiHandler(title) {
	var omdbAPI = new XMLHttpRequest();
	var omdbURL = "https://www.omdbapi.com/?&apikey=5e65d4a0&s=" + title + "&type=movie";

	omdbAPI.addEventListener("load", function() {
	    var result = JSON.parse(this.responseText);
	    console.log(result);

	    //console.log(Object.getOwnPropertyNames(result));

		result.Search.forEach(function(entry) {
  			addListItem(entry.Title + " (" + String(entry.Year) + ")");
		});
	});

	// Ange vilken metod (get) samt URL vi ska skicka med
	omdbAPI.open("get", omdbURL, true);
	// Skicka förfrågan
	omdbAPI.send();
}

function addListItem(string) {
	let li = document.createElement("li");
	li.appendChild(document.createTextNode(string));
	let ul = document.getElementById("items");
	ul.appendChild(li);
}

function removeallChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}

}

function determineIfEmpty(element) {
	console.log(element);
	if (!element.value.match(/\S/)){
    	addListItem("Please enter something.");
    	document.getElementById("items").style.display = "block";
    	return true;
	} else {
		return false;
	}
}