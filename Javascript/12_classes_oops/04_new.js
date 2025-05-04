function setUsername(username) {
    //supposing it's doing, Complex DB calls
    this.username = username
    console.log('called')
}

function createUser(username, email, password) {
    //call() method reference another function outside, and 'this' using for storing setUsername val in createUser function 
    setUsername.call(this, username) 

    this.email = email
    this.password = password
}

const userOne = new createUser("Raj", "raj@gamil.com", 12345)
console.log(userOne)


// New/Modern way to do this work: Is using classes, refer to 06_inheritance.js file