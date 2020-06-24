/* Tarek Bermalm - AK6336. */
"use strict";

let form = document.getElementById("search-form");
form.addEventListener("submit", function(event) {
	removeallChildNodes(document.getElementById("items"));

	let target = event.target || event.srcElement;
	
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

	    if (result.Response == "False"){
	    	document.getElementById("items").style.listStyle = "none";
	    	addListItem(result.Error);
	    } else if (result.Response == "True") {
	    	document.getElementById("items").style.listStyle = "disc";
	    	result.Search.forEach(function(entry) {
  				addListItem(entry.Title + " (" + String(entry.Year) + ")", entry.imdbID);
			});

			//moveToLink("items", result);
	    }
	});

	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();
}

function addListItem(string, imdbID) {
	let url = "https://www.imdb.com/title/" + imdbID + "/";
	string.link(url)
	console.log(string.href.value);
	console.log(string + " och " + url);

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

function moveToLink(elementId, resultList){
	let url = "https://www.imdb.com/title/"

	resultList.Search.forEach(function(entry) {
		url += entry.imdbID + "/";
		console.log(url);		
	});

   	let div = document.getElementById(elementId);
    
    let link = document.createElement('a');
    link.innerHTML = div.outerHTML;
    link.setAttribute('href', 'https://www.imdb.com/title/tt0120338/');
    
    div.parentNode.insertBefore(link, div);
    div.remove();
}
