// Dates
let myDate = new Date()
console.log(typeof myDate)

console.log(myDate)
console.log(myDate.toString())
console.log(myDate.toISOString())
console.log(myDate.toLocaleString())
console.log(myDate.toLocaleDateString())
console.log(myDate.toDateString())

console.log(myDate.getDate())
console.log(myDate.getDay())
console.log(myDate.getHours())
console.log(myDate.getMonth() + 1) //month starts with 0 , we can add 1 to start with 1
console.log(myDate.getFullYear())

let newDate = new Date(2020, 0, 18, 5, 3)
console.log(newDate.toLocaleString())

let newDateOne = new Date("2019-01-29")
console.log(newDateOne.toLocaleString())

let newDateTwo = new Date("01-14-2021")
console.log(newDateTwo.toLocaleString())

let myTimeStamp = Date.now() //assigning date of now 
console.log(myTimeStamp) //give in miliseconds
console.log(newDateTwo.getTime())

console.log(Date.now())
console.log(Math.floor(Date.now()/1000))

newDate.toLocaleString('default', {
    weekday: "long"
})