/* Tarek Bermalm - AK6336. */
"use strict";

const API_KEY = '5e65d4a0&s';

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
		/*ul.style.listStyle = "disc"; //for some reason css doesnt do the job
		console.log(ul.style.listStyle);*/

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
		"Variance Films","Website":"N/A","Response":"True"}
		*/

		let resultContainer = document.getElementById("result");
		resultContainer.appendChild(ul);

		//this code needs to be executed for every item in array: Result.Search
		result.Search.forEach(function(entry) {
			let imdbRating = 0;
			fetchImdbRating(entry.imdbID).then(rating => generateNodes(rating));

			function generateNodes(rating) {
			let entryString = entry.Title + " (" + String(entry.Year) + ")" + ", " + String(rating);
	  		let a = document.createElement('a');  
		    let link = document.createTextNode(entryString); //string goes in ()
		    a.appendChild(link);

		    let url = "https://www.imdb.com/title/" + entry.imdbID + "/";
		    a.href = url;

			let li = document.createElement("li");
			li.appendChild(a);
			ul.appendChild(li);
			}

			

		});
	}

}

async function fetchImdbRating(id) {
	const res = await fetch(`https://www.omdbapi.com/?&apikey=${API_KEY}&s=&i=${id}`);
	const { imdbRating } = await res.json();
	return imdbRating;
}

	/*
	let imdbRating;
		let omdbAPI = new XMLHttpRequest();
	let omdbURL = "https://www.omdbapi.com/?&apikey=5e65d4a0&s=&i=" + imdbID;

	omdbAPI.addEventListener("load", function() {
		let result = JSON.parse(this.responseText);
		imdbRating = parseFloat(result.imdbRating);
		//console.log("ImdbRating is: " + imdbRating);
	});

	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();

	return imdbRating;
	//this will return undefined
	//because the statement is executed before the api request is finished
}*/

/*
	let omdbAPI = new XMLHttpRequest();
	let omdbURL = "https://www.omdbapi.com/?&apikey=5e65d4a0&s=&i=" + imdbID;

	omdbAPI.addEventListener("load", function() {
		let result = JSON.parse(this.responseText);
		imdbRating = parseFloat(result.imdbRating);
		console.log("ImdbRating is: " + imdbRating);
	});

	omdbAPI.open("get", omdbURL, true);
	omdbAPI.send();

}*/
//this is the original content


/*
	let imdbRating;
	
	let apiRequestPromise = new Promise((resolve, reject) => {
		let omdbAPI = new XMLHttpRequest();
		let omdbURL = "https://www.omdbapi.com/?&apikey=5e65d4a0&s=&i=" + imdbID;

		omdbAPI.addEventListener("load", function() {
			let result = JSON.parse(this.responseText);
			imdbRating = parseFloat(result.imdbRating);
			console.log("ImdbRating is: " + imdbRating);

			resolve(imdbRating);

		});

		omdbAPI.open("get", omdbURL, true);
		omdbAPI.send();
	}) 

	apiRequestPromise.then((imdbRating) => {
  		console.log(imdbRating + "from promise .then");
	});
*/
//this isthe attempt at promise content

//what i want to do is call this function from the main flow handler
//then retur the IMDBRATING
	//but the imdbrating is only fetched inside the event listener
	//which presumably sends after the .send() function.
	//What this means is that i have to save it somewhere, and access it after the send() function is executed?

	//Dont forget to change the string in addListItem(), i.e change it to call this method
	//and implement return command here