function sayMyName() {
    console.log("V")
    console.log("I")
    console.log("C")
    console.log("K")
    console.log("Y")
}
//Function call
sayMyName()


function addTwoNumbers(num1, num2) { //num1 and num2 are Parameters
    // let ans = num1 + num2
    // return ans
    return num1 + num2
}
const result = addTwoNumbers(3, 5) //3 and 5 are Arguments
console.log("Result:", result)


function loginUser(username) {
    return `${username} Just logged in`
}
console.log(loginUser("Vicky"))


//Rest operator 
function cartPrice(...num1) { //triple dot called rest operator here
    return num1
}
console.log(cartPrice(100, 200, 300)) //if we passing multiple arguments


const user = {
    username: "Akash",
    price: 299
}

function handleObject(anyobject) {
    console.log(`Username is ${anyobject.username} and Price is ${anyobject.price}`)
}
handleObject(user)
handleObject({ //or we can directly write object here to pass
    username: "Elon",
    price: 199
})

const newArray = [5, 3, 1, 8]
function arrayElement(arr) {
    return arr[1]
}
console.log(arrayElement(newArray))
console.log(arrayElement([1, 2, 3, 4, 5]))

