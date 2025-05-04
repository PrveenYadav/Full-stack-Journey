const score = 400
console.log(score)

//or you can decalre number like that: but here you are 100% sure that it is a number but in line 1 not
const balance = new Number(400)
console.log(balance)

//some properties or prototypes
console.log(balance.toString().length); //first converting on string and then string has length property so printing length of string

//to fixed
console.log(balance.toFixed(2)) //if balance = 100 then after it will be 100.00

//to precision
const anotherNumber = 23.8924
console.log(anotherNumber.toPrecision(3))

const anotherNumberOne = 123.8924 //up from 123.5 will give 124
const anotherNumberTwo = 123.4124 //below 123.5 will give 123
console.log(anotherNumberOne.toPrecision(4))
console.log(anotherNumberTwo.toPrecision(3))

//to localString
const numbersIs = 100000
console.log(numbersIs.toLocaleString()) //it gives on us standords
//numbersIs.toLocaleString('en-IN'); //converting into indian standord of numbers


// ************************** Maths **************************
console.log("************************** Math **************************");
console.log(Math)

//Absolute: it convert only -val into +val
console.log(Math.abs(-4))

//round
console.log(Math.round(4.4))
console.log(Math.round(4.5))

//to control above function(round) we have two more functions
console.log(Math.ceil(4.2)) //it'll always take greater val
console.log(Math.floor(4.9)) //it'll take lowest

//square root
console.log("Square root is: ", Math.sqrt(25))
console.log(Math.pow(5, 3)) //means cube of 5
console.log("Min is: ", Math.min(25, 32, 33, 22, 39, 12))
console.log("Max is: ", Math.max(25, 81))


//Random
console.log(Math.random()) //it gives values in decimal between 0 to 1
console.log((Math.random() * 10) + 1)
console.log(Math.floor(Math.random() * 10) + 1)

//To get random values between 10 to 20
const min = 10
const max = 20

console.log(Math.floor(Math.random() * (max - min + 1)) + min)