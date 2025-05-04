const user  = {
    username: "Arvind",
    id: 1234,
    isLogged: true,

    gotUserDetail: function () {
        // console.log("Got all users data")
        console.log(`Username: ${this.username}`)
        console.log(this)
    }
}

console.log(user.username)
console.log(user.gotUserDetail())
console.log(this) // but in the browser console returns the window


// Constructor function : gives new intance every time
function User(username, id, isLogged) {
    //Properties
    this.username = username
    this.id = id
    this.isLogged = isLogged

    //methods
    this.greeting = function() {
        console.log(`Welcome: ${this.username}`)
    }
}

const userOne = new User("Vicky", 333, false)
const userTwo = new User("Kaushal", 135, true)
console.log(userOne)
console.log(userTwo.constructor)

//Constructor Function : 4 step work
//step-1: By new keyword creates an instance(or empty object)
//step-2: constuctor function call cause of new keyword
//step-3: with this keyword all arguments injects
//step-4: we get values