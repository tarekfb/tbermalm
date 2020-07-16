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
		//saving result
	    let result = JSON.parse(this.responseText);

	    //passing result to function that displays result
	    displayResult(result);
	});

	//executing api request
	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();
}

function displayResult(result) {
	//in this case something went wrong with the search
	//this is communicated through div outputting string result.Error
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
		//in this case the search came through
		//we display result properties in list items
	    //also wrap it in a link to IMDB page
		let ul = document.createElement("ul");
		ul.id = "items";
		ul.style.listStyle = "disc"; //for some reason css doesnt do the job
		console.log(ul.style.listStyle);
		console.log(result.Search[1].imdbrating);
	console.log(result.Search[1].imdbRating);
	console.log(result.Search[1].Imdbrating);
	console.log(result.Search[1].ImdbRating);
	console.log(result.Search[1].properties);
	console.log(result.Search[1].Year);
		console.log(result.properties);
//console.log(result.Search[1].Ratings.Source.imdbRating.value);
		let testRating = result.Search[1].imdbRating;
		console.log(typeof(testRating));

//console.log(result.Search[1].Ratings.imdbRating);

		/*
		{"Title":"Test","Year":"2013","Rated":"TV-MA",
		"Released":"04 Apr 2014","Runtime":"89 min",
		"Genre":"Drama","Director":"Chris Mason Johnson",
		"Writer":"Chris Mason Johnson (screenplay)",
		"Actors":"Scott Marlowe, Matthew Risch, Evan Boomer, Kevin Clarke",
		"Plot":"In 1985, a gay dance understudy hopes for his on-stage chance while fearing the growing AIDS epidemic.","Language":"English, Portuguese, French","Country":"USA","Awards":"3 wins & 3 nominations.","Poster":"https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg",
		"Ratings":[{"Source":"Internet Movie Database","Value":"6.5/10"},
		{"Source":"Rotten Tomatoes","Value":"81%"},
		{"Source":"Metacritic","Value":"70/100"}],"Metascore":"70",
		"imdbRating":"6.5","imdbVotes":"1,407","imdbID":"tt2407380",
		"Type":"movie","DVD":"17 Jun 2014","BoxOffice":"N/A","Production":
		"Variance Films","Website":"N/A","Response":"True"}*/






		let resultContainer = document.getElementById("result");
		resultContainer.appendChild(ul);

		//this code needs to be executed for every item in array: Result.Search
		result.Search.forEach(function(entry) {

			getImdbRating();

			let entryString = entry.Title + " (" + String(entry.Year) + ")" + ", " + String("x");
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

function getImdbRating(imdbID) {
	let omdbAPI = new XMLHttpRequest();
	let omdbURL = "https://www.omdbapi.com/?&apikey=5e65d4a0&s=&i=" + imdbID;

	omdbAPI.addEventListener("load", function() {
		let result = JSON.parse(this.responseText);
		let imdbRating = parseInt(result.imdbRating);
		console.log("ImdbRating is: " + imdbRating);	
		console.log("intui");
			});

	omdbAPI.open("get", omdbURL, true);
	console.log("mellan");
	omdbAPI.send();

	console.log("utanför");

//what i want to do is call this function from the main flow handler
//then retur the IMDBRATING
	//but the imdbrating is only fetched inside the event listener
	//which presumably sends after the .send() function.
	//What this means is that i have to save it somewhere, and access it after the send() function is executed?

	//Dont forget to change the string in addListItem(), i.e change it to call this method
	//and implement return command here

}

function function_name(argument) {
	// body...
}
