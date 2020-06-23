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
		let target = event.target || event.srcElement;

		//this is neccessary because can't use .length if not convert to string
		let firstnameValue = this.elements.firstname.value;
		let lastnameValue = this.elements.lastname.value;
		let ageValue = (this.elements.age.value);
		let emailValue = this.elements.email.value;
		let petValue = 	this.elements.pet.value;

		String(firstnameValue, lastnameValue, emailValue, petValue);
		console.log(firstnameValue, lastnameValue, ageValue, emailValue, petValue);

		if (firstnameValue.length > 50){
			alert("Förnamnet måste vara kortare än 50 bokstäver.")
			event.preventDefault();
		} else if (lastnameValue.length > 50){
			alert("Efternamnet måste vara kortare än 50 bokstäver.")
			event.preventDefault();
		} else if (ageValue <= 0 || isNaN(ageValue)){
			alert("Åldern måste vara en siffra och högre än 0.")
			event.preventDefault();
		}else if (emailValue.length > 50){
			alert("Epostadressen måste vara kortare än 50 bokstäver.")
			event.preventDefault();
		} else{
			event.target.submit();
		}
	});
}