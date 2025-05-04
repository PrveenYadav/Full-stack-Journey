//Arrow Functions and this keyword

//usually this keyword used in objects not in the functions but we can use int fuctions

const user = {
    username: "Ramesh",
    price: 199,

    welcomeMassege: function() {
        console.log(`${this.username}, Welcome to website`)
        console.log(this)
    }
}

// user.welcomeMassege()
// user.username = "Aria"
// user.welcomeMassege()

console.log(this) //this is giving empty, if we run this line in console(browser) then it will give window 


//Arrow function declaration
const one = () => {
    let username = "Hello"
    console.log(username)
    console.log(this)
}
one()

//Explicit return: when using the return keyword
const addTwo = (num1, num2) => {
    return num1 + num2
}
console.log(addTwo(3, 4))

//Implicit return: not using return keyword
const addTwo1 = (num1, num2) => num1 + num2 
console.log(addTwo1(2, 7))

const forObjects = (num1, num2) => ({username: "Praveen"})
console.log(forObjects())