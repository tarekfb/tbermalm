"use strict";
/* Tarek Bermalm - AK6336. */

/**
 * Uppgift 1
 * =========
 */

function max(firstVal, SecondVal){
	if (firstVal > SecondVal){
		return firstVal;
	}
	else if (SecondVal > firstVal){
		return SecondVal;
	}
}

function min(firstVal, SecondVal){
	if (firstVal < SecondVal){
		return firstVal;
	}
	else if (SecondVal < firstVal){
		return SecondVal;
	}
}

/**
 * Uppgift 2
 * =========
 */

function range(n){
	let numbersArray = [];
	numbersArray.length = n;


	for (var i = 0; i < numbersArray.length; i++) {
		numbersArray[i] = i;
	}
	
	return numbersArray;
}

var testArray = range(10);
console.log(testArray);


/**
 * Uppgift 3
 * =========
 */

function sum(array) {
	let sum = 0;
	let numbers = array;

	for (var i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return sum;
}

var numbers = [5, 10, 15, 20, 25];
var sumOfNumbers = sum(numbers);
console.log(sumOfNumbers);


/**
 * Uppgift 4
 * =========
 */

function countCharacter(string, char) {
	let nbrOfTimes = 0;
	for (var i = 0; i < string.length; i++) {
		if (string[i] == char){
			nbrOfTimes += 1;
		}
	}
	console.log(nbrOfTimes);
	return nbrOfTimes;
}

countCharacter("aasd", 'a');
countCharacter("aasd", 'b');


/**
 * Uppgift 5
 * =========
 */

function palindrome(string) {
	let palindromeApproved;
	let reversedString = string.split("").reverse().join("");

	if (string == reversedString){
		palindromeApproved = true;
	} else if (string != reversedString){
		palindromeApproved = false;
	}
	return palindromeApproved;
}

console.log(palindrome("asd"));
console.log(palindrome("sirap i paris"));

/**
 * Uppgift ´6
 * =========
 */

function PersonConstr(first, last, age, family) {
	this.firstName = first;
	this.lastName = last;
	this.age = age;
	this.familyMembers = family;
}
let person = new PersonConstr("Tarek", "Ipsum", "50", ["Mamma", "Pappa"]);

console.log(person);

 /**
 * Uppgift 7
 * =========
 */

function printPerson(object) {
	let familyMembersString = "";
	object.familyMembers.forEach(function(entry) {
  		familyMembersString += entry + ", ";
	});
	familyMembersString = familyMembersString.substring(0, familyMembersString.length - 2);
	console.log("Fullname and age: " + object.firstName + " " + object.lastName + ", " + person.age);
	console.log("Family: " + familyMembersString);
}

printPerson(person);


 /**
 * Uppgift 8
 * =========
 */

function createBox(height, width) {
	function BoxConstr(height, width) {
		this.height = height;
		this.width = width;
	}
	return new BoxConstr(height, width);
}
var box = createBox(15, 20);
console.log(box.height); 
console.log(box.width);

 /**
 * Uppgift 9
 * =========
 */

function triangle(height, width) {
 	function TriangleConstr(height, width) {
		this.height = height;
		this.width = width;
		this.area = function(){
			return this.height * this.width / 2;
		}
	}
	return new TriangleConstr(height, width);

}
var tri = triangle(12, 14);

console.log(tri.height); // skickar tillbaka 12
console.log(tri.width); // skickar tillbaka 14
tri.area();
// Observera att vi anropar "area()"
console.log(tri.area()); // skickar tillbaka 84

 /**
 * Uppgift 10
 * =========
 */
