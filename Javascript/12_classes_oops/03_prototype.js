let myHeroes = ['thor', 'spiderman', 'ironman']

let heroPower = {
    hammer: 'hulk',
    thor: 'rangnrok',
    tonystark: 'ironman',

    getThorPower: function() {
        console.log(`Thor's power is ${this.thor}`)
    }
}

Object.prototype.vicky = function() {
    console.log('Vicky is present in all objects')
}

//injecting in array
Array.prototype.sayHello = function() {
    console.log(`hey, what's up`)
}

//in the end everything(array, function, string) goes through the object and object reference to null 
heroPower.vicky() 
myHeroes.vicky() //check with array: it has access of that function
myHeroes.sayHello()


// Inheritance
const user = {
    name: "John",
    id: 2314
}

const Teacher = {
    makeVideo: true
}

const TeachingSupport = {
    isAvailable: false
}

const TAsupport = {
    makeAssignment: "JavaScript Assignment",
    fullTime: true
}

// Teacher is accessing the properties of user: it's called prototyple inheritance
Teacher.__proto__ = user //old version

//modern syntax
Object.setPrototypeOf(Teacher, TAsupport)


let username = "Vicky       "
// To get actual length of username, not spaces we are creating a method

String.prototype.trueLength = function() {
    console.log(`${this}`)
    console.log(`True length is: ${this.trim().length}`)
}

username.trueLength()
"Choudhary".trueLength()
"Bye   ".trueLength()