console.log(Math.PI) //constant: it can't be change even after overwrite
Math.PI = 8
console.log(Math.PI)

//It tells hidden properties of object
const val = Object.getOwnPropertyDescriptor(Math, 'PI')
console.log(val)


// Crating an object
const obj  = {
    name: "Pure Desi Ghee",
    price: 1999,
    isAvailable: true,

    doSomething: function() {
        console.log("hello ji...")
    }
}

console.log(Object.getOwnPropertyDescriptor(obj, "name"))
// making unchangable to name
Object.defineProperty(obj, 'name', {
    writable: false,
    enumerable: false //name: will be not iteratable
})
console.log(Object.getOwnPropertyDescriptor(obj, 'name'))


//iterating on obj
for (let [key,val] of Object.entries(obj)) {
    if(typeof val !== 'function') {
        console.log(`${key} : ${val}`)
    }
}