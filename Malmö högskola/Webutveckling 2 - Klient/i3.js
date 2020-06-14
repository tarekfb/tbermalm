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
	var liValue = prompt("Please enter some text");
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(liValue));
	var ul = document.getElementById("items");
	ul.appendChild(li);
}

/**
 * Uppgift 3
 * =========
 */

Uppgift 3

I den tredje uppgiften ska ni komplettera Uppgift 2 med en extra knapp. Ni väljer själv id och text. Denna knapp ska, när en användare klickar på den, radera det sista elementet i listan <ul id="items">.

Tips: använd er av .lastElementChild i kombination med .removeChild.

/**
 * Uppgift 4
 * =========
 */

