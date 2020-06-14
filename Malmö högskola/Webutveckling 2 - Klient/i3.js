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

let form = document.getElementsById("apply-for-pet");
console.log(form);
form.addEventListener("submit", function(event) {
	event.preventDefault();
	//if sats -->  event.target.submit();
});

console.log(this.elements.firstname.value);