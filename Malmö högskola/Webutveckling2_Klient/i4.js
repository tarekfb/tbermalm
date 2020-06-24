/* Tarek Bermalm - AK6336. */
"use strict";

let form = document.getElementById("search-form");
form.addEventListener("submit", function(event) {
	removeallChildNodes(document.getElementById("items"));
	let target = event.target || event.srcElement;
	
	/*
	if (!document.getElementById("text-box").value.match(/\S/)){
    	addListItem("Please enter something.");
    	document.getElementById("items").style.listStyle = "none";
	} else {
		document.getElementById("items").style.listStyle = "circle";
		let queryText = form.elements.query.value;
		apiHandler(encodeURI(queryText));
	}
	*/
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

	    //should rewrite into:
	    //if result.Response; proceed
	    //else if !result.Response; print error text
	    if (result.Response == false){
	    	console.log(result.Response + 1);
	    	document.getElementById("items").style.listStyle = "none";
	    	addListItem(result.Error);
	    } else if (result.Response) {
	    	console.log(result.Response + 2);
	    	document.getElementById("items").style.listStyle = "circle";
	    	result.Search.forEach(function(entry) {
  				addListItem(entry.Title + " (" + String(entry.Year) + ")");
			});
	    }

		
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