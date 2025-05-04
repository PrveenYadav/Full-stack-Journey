// Object Literals

const mySym = Symbol("key")

const myObj = {
    name: "Vicky",
    "full name": "Vicky Choudhary",
    "anotherName": "Raj Choudhary",
    [mySym]: "key1",
    age: 15, 
    email: "vicky@google.com",
    location: "Bengluru",
    isLogged: false,
    lastLoggedDays: ["Monday", "Saturday"]
}

console.log(myObj.name)
console.log(myObj["email"])
console.log(myObj["full name"]) //we cant's access with dot
console.log(myObj.anotherName) //but it can be
console.log(myObj[mySym])

//change in object, and after freeze
myObj.email = "newChatgpt@gmail.com"
Object.freeze(myObj) //after freeze we cant't change values of myObj
myObj.email = "hello@facebook.com"
console.log(myObj)



//creating another object
const myObj2 = {
    name: "Vicky",
    age: 15, 
    email: "vicky@google.com",
    location: "Bengluru",
}

//In js we can treat Functions like variables
myObj2.greeting = function() {
    console.log("Hello whats up")
}

myObj2.greetingOne = function() {
    console.log(`Hello whats up, ${this.name}`)
}

console.log(myObj2.greeting())
console.log(myObj2.greetingOne())
