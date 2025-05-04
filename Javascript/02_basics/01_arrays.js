//Arrays in JavaScript: arr can contain Mixed different datatypes and they are Resizeable
//Array is a Object and Non-primitive data type

const arr = [1, 2, 3, 4]
const arr1 = ["Hello", "Okay", "Bye"]
const arr2 = new Array(2, 5, 7, 9)
console.log(arr[2])

//Array Methods
arr.push(5)
arr.pop()
console.log(arr)
arr.unshift(9)
arr.shift()
console.log(arr)

console.log(arr.includes(9)) //checks 9 is there in arr or not
console.log(arr.indexOf(4))

//int join() : val's data type will be cahnge object to string
const newArr = arr.join()
console.log(arr)
console.log(newArr) 
console.log(typeof(arr), typeof(newArr))

//slice and splice
console.log("Array:", arr)

const newOne = arr.slice(1, 3)
console.log("Slice: ", newOne)
console.log("After Slice Original Array:", arr)

newTwo = arr.splice(1, 3)
console.log("Splice: ", newTwo)
console.log("After Splice Original Array:", arr)