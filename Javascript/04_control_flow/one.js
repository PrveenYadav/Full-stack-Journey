//Comparision Operators
// <, >, <=, >=, ==, !=, ===, !==

if(2 === "2") {
    console.log("Yes")
}else {
    console.log("No, === also checks the data type")
}

if(2 == "2") console.log("Yes")
else console.log("No")

//Switch statement
const month = 3

switch (month) {
    case 1:
        console.log("January")
        break;
    case 2:
        console.log("February")
        break;
    case 3:
        console.log("March")
        break;
    case 4:
        console.log("April")
        break;

    default:
        console.log("Not Valid")
        break;
}

//Truthy and Falsy Values

// const userEmail = "abc@gmail.com"
// const userEmail = ""
const userEmail = []

if(userEmail) {
    console.log("Got the Email")
}else {
    console.log("Don't have User Email")
}

//Falsy Values: false, 0, -0, BigInt 0n, "", null, undefined, NaN
//Truthy Values: true, 1, "0", 'false', " ", [], {}, function(){}

if(userEmail.length === 0) console.log("Array is Empty")

const myObj = {}
if(Object.keys(myObj).length === 0) console.log("Object is Empty")


// Nullish Coalescing Operator (??) : For null and undefined
let val1;
// val1 = 5 ?? 10
// val1 = null ?? 10
// val1 = undefined ?? 15
val1 = null ?? 15 ?? 30

console.log(val1)


//Terniary Operator
// condition ? true : false
const iceTeaPrice = 200
iceTeaPrice <= 100 ? console.log("Tea is Affordable") : console.log("Tea is Expensive")