"use strict";
/* Tarek Bermalm - AK6336. */

/**
 * Uppgift 1
 * =========
 */

function changeClass(id){
     document.getElementById((event.srcElement.id)).className = (event.srcElement.id);
}
/**
 * Uppgift 2
 * =========
 */

function addItem() {
	let liValue = prompt("Please enter some text");
	let li = document.createElement("li");
	li.appendChild(document.createTextNode(liValue));
	let ul = document.getElementById("items");
	ul.appendChild(li);
}

/**
 * Uppgift 3
 * =========
 */

function removeItem() {
	let list = document.getElementById("items");
	let lastLi = list.lastElementChild;
	console.log(list.lastElementChild);
	list.removeChild(list.lastElementChild);
}

/**
 * Uppgift 4
 * =========
 */

function removeElement() {
	let target = event.target || event.srcElement;
	let liBeingRemoved = target.parentElement;

	let response = confirm("Do you want to delete the item?");
	if (response){
		liBeingRemoved.parentElement.removeChild(liBeingRemoved);
	}
}

/**
 * Uppgift 5
 * =========
 */

 /*
 *Wrapping this assignment in a function
 *the script does not seem to wait for the DOM to load before executing
 *the script now runs when body is loaded
 *effectively forces script to wait
 *
 *if this is programmed outside of the function, form is undefined
 *https://stackoverflow.com/questions/38428797/document-getelementbyid-is-not-working-for-a-form
 */

function delayScript() {
	let form = document.getElementById("apply-for-pet");
	form.addEventListener("submit", function(event) {
		//let target = event.target || event.srcElement;

		console.log(this.elements.firstname.value);
		console.log(this.elements.lastname.value);
		console.log(this.elements.age.value);
		console.log(this.elements.email.value);
		console.log(this.elements.pet.value);
/*
		if (this.elements.firstname.value.length > 0 && this.elements.firstname.value <= 50){
			console.log("första");
		} else if (true){
			console.log("amdra");
		} else{
		event.preventDefault();
		console.log("tredje");

		//if sats (t.ex. när vi validerat alla fältens innehåll){
		//	event.target.submit();
		//}
		}*/
		
	});
}



