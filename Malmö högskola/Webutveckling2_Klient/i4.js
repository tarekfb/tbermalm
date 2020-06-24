/* Tarek Bermalm - AK6336. */
"use strict";

let form = document.getElementById("search-form");
form.addEventListener("submit", function(event) {
	let target = event.target || event.srcElement;

	let queryText = form.elements.query.value;
	apiHandler(encodeURI(queryText));

	event.preventDefault();
		
});

function apiHandler(title) {
	var omdbAPI = new XMLHttpRequest();
	var omdbURL = "http://www.omdbapi.com/?&apikey=5e65d4a0&s=" + title + "&type=movie";

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
var str = new String("asd");
alert(str.fontcolor("blue"));