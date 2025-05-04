/*
Both are empty object:
const tinderUser = new Object() //singleton object
const tinderUser1 = {} //non-singleton object
*/
const tinderUser = {}

tinderUser.id = "123abc"
tinderUser.name = "Sam"
tinderUser.isLogged = "false"
console.log(tinderUser)

//Object Nesting 
const newUser = {
    email: "some@gmail.com",
    fullName: {
        userFullName: {
            firstName: "Vicky",
            lastName: "Choudhary"
        }
    }
}

// console.log(newUser)
// console.log(newUser.fullName)
// console.log(newUser.fullName.userFullName)
console.log(newUser.fullName.userFullName.firstName)


const obj1 = {1: "a", 2: "b"}
const obj2 = {3: "c", 4: "d"}
//const obj3 = {obj1, obj2} 
// const obj3 = Object.assign(obj1, obj2)
const obj3 = {...obj1, ...obj2} //or like that 
console.log(obj3);


const users = [
    {
        id: 1,
        email: "okay@gmail.com"
    },
    {
        id: 1,
        email: "okay@gmail.com"
    },
    {
        id: 1,
        email: "okay@gmail.com"
    }
]
console.log(users[1].email)

console.log(tinderUser)
console.log(Object.keys(tinderUser))
console.log(Object.values(tinderUser))
console.log(Object.entries(tinderUser))

console.log(tinderUser.hasOwnProperty('isLogged'))


const course = {
    courseName: "Js in Hindi",
    price: "999",
    courseInstructor: "Hitesh"
}

// Another way to access these values
// Destructuring
const {courseInstructor: Guru} = course
console.log(Guru)


//When we call APIs then values comes in JSON format, But in the past values was used to come in XML
