// class based getter setter : 90 - 95% used class based
class User {
    constructor(email, password) {
        this.email = email
        this.password = password
    }

    get email() {
        return this._email.toUpperCase();
    }
    set email(val) {
        return this._email = val;
    }

    get password() {
        return `${this.newPassword}jinhi`;
    }
    set password(val) {
        return this.newPassword = val;
    }
}

const userOne = new User("ok@gmail.com", 123)
console.log(userOne.email)
console.log(userOne.password)


// Function based Getter and setter : previous version
function anotherUser(email, password) {
    this.newEmail = email
    this.newPassword  = password

    Object.defineProperty(this, 'email', {
        get: function(){
            return this.newEmail.toUpperCase();
        },
        set: function(val) {
            return this.newEmail = val
        }
    })

    Object.defineProperty(this, 'password', {
        get: function(){
            return `${this.newPassword}changed`;
        },
        set: function(val) {
            return this.newPassword = val
        }
    })
}

const userTwo = new anotherUser("another@gmail.com", 4321)
console.log(userTwo.email)
console.log(userTwo.password)


// Object based getter and setter : old version
const userObj = {
    newEmail: "old@gmail.com",
    newPassword: 3431,

    get email() {
        return `${this.newEmail}_Protected`
    },
    set email(val) {
        return this.newEmail = val;
    }
}

// create() is a factory function: they are default function of object
const userThree = Object.create(userObj)
console.log(userThree.email)