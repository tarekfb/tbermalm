"use strict";
/* Tarek Bermalm - AK6336. */

/**
 * Uppgift 1
 * =========
 */

console.log( 5 * 2 < 12 );
console.log( 55 != 22 );
console.log( 16 / 4 == 4 );
console.log( 8 + 2 <= 128 );
console.log( 32 * 8 > 255 );

/**
 * Uppgift 2
 * =========
 */

let weekday = "Tisdag";
let food = "Hamburgare";
let quote = "I'll be back";

console.log(weekday.substring(0, 3));
console.log(food.substring(3, 10));
console.log(quote.substring(5, 12));

/**
 * Uppgift 3
 * =========
 */

let firstString = "It's learning";
let secondString = "JavaScript: The Good Parts";

console.log(firstString.toUpperCase().substring(5, 13));
console.log(secondString.toLowerCase().substring(16, 26));

/**
 * Uppgift 4
 * =========
 */

var numbers = [128, 256, 512, 1024, 2048];
let sumOfNumbers = 0;

numbers.forEach(function(entry) {
	sumOfNumbers += entry;
});
console.log(sumOfNumbers);

let avgNumber = sumOfNumbers / numbers.length;
console.log(avgNumber);

numbers.push(1);
console.log(numbers);

/**
 * Uppgift 5
 * =========
 */

var countries = ["Sweden", "Denmark", "Finland", "Norway"];
console.log(countries[1].substring(0, 3));


let avgLengthCountry = 0;
countries.forEach(function(entry){
	avgLengthCountry += entry.length;
});
console.log(avgLengthCountry / countries.length);

 /**
 * Uppgift 6
 * =========
 */

var values = [3, 5, "Jane", true, 144, false];
console.log(values.reverse());

/**
 * Uppgift 7
 * =========
 */

var names = ["Jane", "Joe", "Eliza"];
var ages = [21, 34, 22];
var hasPet = [true, false, true];

var multipleArrays = names + ages + hasPet;
console.log(multipleArrays);

 /**
 * Uppgift 8
 * =========
 */
let multipleStrings = "";
var actors = ["Sherlock", "Watson", "Bo"];
actors.forEach(function(entry){
	multipleStrings += entry;
});
console.log(multipleStrings);

 /**
 * Uppgift 9
 * =========
 */

 let amount = 0;
 if (amount < 50){
 	 console.log("Less then 50!");
 } else if (amount => 50){
 	 console.log("Optimal range for the amount!");
 } else {
 	console.log("Too much!");
 }

 /**
 * Uppgift 10
 * =========
 */

let hashtag = "#"
let i;
for (i = 0; i < 8; i++){
	console.log(hashtag);
	hashtag += "#";
}
