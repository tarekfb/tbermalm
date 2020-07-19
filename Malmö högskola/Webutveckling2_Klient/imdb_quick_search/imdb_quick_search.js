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

		let resultContainer = document.getElementById("result");
		resultContainer.appendChild(ul);

		//this code needs to be executed for every item in array: Result.Search
		result.Search.forEach(function(entry) {

			//fetching the imdbRating is awkwardly designed
			//first usage of promise and async
			//found some fetch magic online
			//will try to document for my own sake, i suppose

			let imdbRating = 0;
			//im running the async fun fetchImdbRating (a thenable promise)
			//which returns a rating after the request comes through
			//when the fetch has been resolved it moves to .then
			//.then has a callback (function, object) attached to it
			//generateNodes creates the appriopriate nodes
			//the items are displayed and task is complete

			fetchImdbRating(entry.imdbID).then(rating => generateNodesForLi(rating));

			function generateNodesForLi(rating) {

				let li = document.createElement("li");
				ul.appendChild(li);

				let a = document.createElement("a");  
			    let url = "https://www.imdb.com/title/" + entry.imdbID + "/";
			    a.href = url;
				li.appendChild(a);

				let movieContainer = document.createElement('div');
				movieContainer.id = 'movie-container';
				a.appendChild(movieContainer);
				
				let img = document.createElement('img');
				img.src = 'test.jpg';
				movieContainer.appendChild(img);

				let text = document.createElement('div');
				text.id = "text";
				movieContainer.appendChild(text);

				let titleYear = document.createElement("span");
				titleYear.id = "title-year";
				titleYear.appendChild(document.createTextNode(entry.Title + " (" + String(entry.Year) + ")" + "<br />"));
				text.appendChild(titleYear);
				//titleYear.insertAfter(createElement("br"));

				let actors = document.createElement("span");
				actors.id = "actors";
				titleYear.appendChild(document.createTextNode("Jennyfar AniStån, Mak Valburg, Brady P")); //TO-DO: fix
				text.appendChild(actors);

				let ratingDiv = document.createElement('div');
				ratingDiv.id = "rating";
				movieContainer.appendChild(ratingDiv);

				let i = document.createElement("i");
				i.class = "";






				/*__________________________________________

				let img = document.createElement('img');
				img.src = 'test.jpg';

				let titleYear = document.createElement("span");
				titleYear.id = "title-year";
				titleYear.appendChild(document.createTextNode(entry.Title + " (" + String(entry.Year) + ")"));


				let movieContainer = document.createElement('div');
				movieContainer.id = 'movie-container';

				let img = document.createElement('img');
				img.src = 'test.jpg';
				movieContainer.appendChild(img);

				let text = document.createElement('div');
				text.id = "text";
				movieContainer.appendChild(text);

				let titleYear = document.createElement("span");
				titleYear.id = "title-year";
				titleYear.appendChild(document.createTextNode(entry.Title + " (" + String(entry.Year) + ")"));
				text.appendChild(titleYear);
				*/





				
			}	
			//TO-DO: creating new function, renaming to 1 temporariliy
			function generateNodes1(rating) {
				let div = document.createElement('div');
				div.id = 'li-container';

				let entryString = entry.Title + " (" + String(entry.Year) + ")" + ", " + String(rating);
		  		let a = document.createElement('a');  
			    let link = document.createTextNode(entryString);
			    a.appendChild(link);

			    div.appendChild(a);

			    let url = "https://www.imdb.com/title/" + entry.imdbID + "/";
			    a.href = url;

				let li = document.createElement("li");
				//li.appendChild(a);
				li.appendChild(div);

				ul.appendChild(li);
			}	
		});
	}

}

//this is an async function (A promise, right?)
//allowing us to use await
//await forces the compiler to wait for the given task to be completed before proceeding
//(only stops locally, not the entire program)
//when the fetch as been resolved, the compiler tries to declare an object and give it the return value of res.json();
//it then returns the imdbRating and the program proceeds as normally

//however, I have no clue how we circument the otherwise needed "open(), send() with the arguments get, omdbURL, true"
//my guess is that fetch has no need for these arguments, but only the appriopriate url
async function fetchImdbRating(id) {
	const res = await fetch(`https://www.omdbapi.com/?&apikey=${API_KEY}&s=&i=${id}`);
	const { imdbRating } = await res.json();
	return imdbRating;
}
/*leaving some notes from programming diary

Event-driven languages, and callbacks
Imdb ratings lookup tool
16/06/2020

Bumped into an issue when creating my imdb rating lookup tool. 
Javascript is apparently an event-driven language, which means the compiler doesn’t wait for responses when executing code, but instead continues with the next operation. 
This can be tricky, when you want to wait for a function to finish executing, for example in-order to update a variable value. 
In my case my return statement returns the initial variable declaration, 0, instead of the updated value. 
Because the value, updated by an event listener, has been updated after the return statement is executed.
*/