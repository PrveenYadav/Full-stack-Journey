console.log(2 >= 2)

console.log(null == 0)
console.log(null >= 0)
console.log(undefined == "")

console.log("hello world")

// *********** DATA TYPES ************

//1. Primitive: 7 Types : String, Number, Boolean, null, undefined, Symbol, BigInt

const id = Symbol('124')
const anotherId = Symbol('124')

const bigNumbers = 1233450079872934969692793n

//2. Non-Primitive(Reference): Array, Objects, Functions
const heros = ["Iron Man", "Thor", "Spiderman"]

let myObj = {
    name: "Vicky",
    age: 22,
}

const myFunction = function(){
    console.log("Hello World");
}

//how to know data type of any variable
console.log(typeof bigNumbers); 



// ********************** Memory ***********************

// 2 types of memory : Stack(primitive) and Heap(non-primitive)
// stack used in primitive data types and Heap used in non-primitive data types
// Stack memory is like : Pass by value
// Heap memory is like : Pass by reference

let myYoutubeName = "hello123.com"

let anotherName = myYoutubeName
anotherName = "siri@321.com"

console.log(myYoutubeName)
console.log(anotherName); //value is copy here not changes made in actual val so, it's a stack memory


let userOne = {
    email: "kash@gmail.com",
    upi: "user@ybl"
}

let userTwo = userOne

userTwo.email = "hitesh@google.com" //Heap memory(reference), change will be in original value

console.log(userOne.email)
console.log(userTwo.email)