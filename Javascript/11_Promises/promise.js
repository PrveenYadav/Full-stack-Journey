const promiseOne = new Promise(function(resolve, reject) {
    //Do an Async task
    // Database calls, cryptography, network calls
    setTimeout(function(){
        console.log("Async task one")
        resolve()
    }, 1000)
})

promiseOne.then(function(){
    console.log("Async one resolved")
})

new Promise(function(resolve, reject) {
    setTimeout(() => {
        console.log("Async task two completed")
        resolve()
    }, 1000)
}).then(() => {
    console.log("Async two resolved")
})


const promiseThree = new Promise(function(resolve, reject){
    setTimeout(function(){
        resolve({username: "Vicky Choudhary", id: 2143})
    }, 1000)
})

promiseThree.then(function(info){
    console.log(info)
})


const promiseFour = new Promise((resolve, reject) => {
    setTimeout(()=>{
        let error = false
        if(!error) {
            resolve({username: "Akash", password: 123})
        }else{
            reject('ERROR: Something went wrong')
        }
    }, 1000)
})

promiseFour.then((obj) => {
    console.log(obj)
    return obj.username
}).then((username)=>{
    console.log(username)
}).catch((error)=>{
    console.log(error)
}).finally(()=> console.log("The promise is either resolved or rejected"))

// Accessing Promise by Async await insted of .then()
// it does'nt handle errors directly 
const promiseFive = new Promise((resolve, reject) => {
    setTimeout(()=>{
        let error = false
        if(!error) {
            resolve({username: "JavaScript", email: "abc@gmail.com"})
        }else{
            reject('ERROR: JS went wrong')
        }
    }, 1000)
})

async function consumePromiseFive() {
    const response = await promiseFive
    console.log(response)
}
consumePromiseFive()

const promiseSix = new Promise((resolve, reject) => {
    setTimeout(()=>{
        let error = false // true, if there is error
        if(!error) {
            resolve({username: "JavaScript", email: "abc@gmail.com"})
        }else{
            reject('ERROR: JS went wrong')
        }
    }, 1000)
})

// To handle error using try and catch
async function consumePromiseSix() {
    try {
        const response = await promiseFive
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}
consumePromiseSix()


//fetching api using async await
async function getUsersData() {
    try {
        // api fetch() takes times so we are awaiting it
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        const data = await response.json() // converting into json format
        console.log(data)
    } catch (error) {
        console.log("Error:", error)
    }
}
getUsersData();


//Using .then() method
fetch('https://api.github.com/users/hiteshchoudhary')
.then((response) => {
    return response.json()
}).then((data) => {
    console.log(data)
}).catch((error) => console.log(error))