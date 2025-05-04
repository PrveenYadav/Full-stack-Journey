
class user {
    //constructor
    constructor (username, email, password) {
        this.username = username;
        this.email = email
        this.password = password;
    }

    encryptPassword() {
        return `${this.password}abc`;
    }

    changeUserName() {
        return `${this.username.toUpperCase()}`
    }
}

//creating object
const userOne = new user("Ram", "ram@gmail.com", 9211)

//Printing values
console.log(userOne.encryptPassword());
console.log(userOne.changeUserName());


// If we'll not use classes then how this work will be done: Behind the scene
function User(username, email, password) {
    this.username = username;
    this.email = email
    this.password = password;
}

User.encryptPassword = function() {
    return `${this.password}abc`;
}

User.changeUserName = function() {
    return `${this.username.toUpperCase()}`
}

const userTwo = new user("Vicky", "vickyJi@gmail.com", 1928)
console.log(userTwo.encryptPassword());
console.log(userTwo.changeUserName());