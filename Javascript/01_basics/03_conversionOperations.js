let score = "33"

console.log(typeof(score))

let valueInNumber = Number(score) //type conversion
console.log(typeof(valueInNumber))
console.log(valueInNumber)

let score1 = "34abc" //if 2 type of values then type conversion and print it will give NaN(Not a Number)
let val = Number(score1)
console.log(typeof(val))
console.log(val)

/*
Values when converting in Number:

"33" => 33
"33abc" => NaN
true => 1; false => 0
null => 0
undefined = NaN
*/


//********************************* Operations ********************************
let value = 3
let negVal = -value
console.log(negVal)

console.log(10+2)
console.log(10-2)
console.log(10*2)
console.log(10**2) //means 10^2
console.log(10/2)
console.log(10%2)

let str1 = "Hello"
let str2 = " Bhai"
let str3 = str1 + str2
console.log(str3)

console.log("1" + 2)
console.log(1 + "2")
console.log("1" + 2 + 2)
console.log(1 + 2 + "2")