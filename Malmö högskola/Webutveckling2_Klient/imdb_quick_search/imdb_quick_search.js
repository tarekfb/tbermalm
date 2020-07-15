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
	var omdbURL = "https://www.omdbapi.com/?&apikey=5e65d4a0&s=" + title + "&type=movie";

	omdbAPI.addEventListener("load", function() {
	    var result = JSON.parse(this.responseText);
	    console.log(result);

	    if (result.Response == "False"){
	    	addListItem(result.Error, null);
	    } else if (result.Response == "True") {
	    	result.Search.forEach(function(entry) {
  				addListItem(entry.Title + " (" + String(entry.Year) + ")", entry.imdbID);
			});

			sortListByRating(result);
	    }
	});

	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();
}

function addListItem(string, imdbID) {
	let containerDiv = document.getElementById("result");
	containerDiv.querySelectorAll('*').forEach(n => n.remove());

	if (imdbID == null){
		if (string == "Too many results."){
			string += " Try to be more specific."
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
	}

}

function rearrangeElementsForResponsiveDesign() {

	/*var h = parseInt(window.innerHeight);
	var w = parseInt(window.innerWidth);

    if(w < 900 && h < 1300) {
        console.log(h, w);
        let referenceNode = document.getElementById("title");
		let targetNode = document.getElementById("logo");
		referenceNode.parentNode.insertBefore(targetNode, referenceNode.nextSibling);
    }*/
} //dont need this function anymore, but leaving up as it was educational

rearrangeElementsForResponsiveDesign();

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

document.getElementById('text-box').scrollIntoView();
console.log(document.getElementById('text-box'));
document.getElementById('text-box').focus();