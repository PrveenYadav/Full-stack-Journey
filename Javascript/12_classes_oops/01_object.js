function multipleOfFive(num) {
    return num*5;
}
multipleOfFive.power = 2

console.log(multipleOfFive(4))
console.log(multipleOfFive.power)
console.log(multipleOfFive.prototype)

function createUser(username, price) {
    this.username = username
    this.price = price
}

createUser.prototype.increment = function() {
    this.price++;
}

createUser.prototype.printMe = function() {
    console.log(`price is: ${this.price}`)
}

const user1 = new createUser('chai', 25)
const user2 = new createUser('coffee', 80)

user1.increment()
user1.printMe()

user2.increment()
user2.printMe()

/* 
Here is what happens behind the scene when the new keyword is used:

A new object is created: The new keyword initiates the creation of new javaScript object

A prototype is linked: The newly created object gets linked to the prototype property of the constructor function. This means it has access to properties and methods difined on the constructor's prototype.

The constructor is called: The constructor function is called with the specified arguments and this is bound to the newly created object. If no explicit return value is specified from the javaScript constructor, javaScript assumed this, the newly created object, to be the intended return value.

The new object is returned: After the constructor function has been called, if it does'nt return a non-primitive value(object, array, function, etc.), the newly created object is returned.

*/