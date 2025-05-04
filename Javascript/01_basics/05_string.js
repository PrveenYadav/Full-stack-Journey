const name = "Hello"
const rollNum = 25

//concatination
console.log(name + rollNum);

//Better way in modern way to cancate
console.log(`My name is ${name} and number is ${rollNum}`);

//another way to declare string
const gameName = new String('Tony')
console.log(gameName[0])

//methods and prototypes in string : You can see all prototypes by running line:11 code on console(browser)
console.log(gameName.length)
console.log(gameName.toUpperCase());

//charAt and indexOf
console.log(gameName.charAt(2))
console.log(gameName.indexOf('o'));

//substring
const newString = gameName.substring(0, 2)
console.log(newString)

//slice
const anotherString = gameName.slice(2, 3)
console.log(anotherString)

//trim
const newStringOne = "    Chaudhary      "
console.log(newStringOne)
console.log(newStringOne.trim()) //triming extra spaces

//replace, include
const url = "https://Google.com/google%20chaudhary"

console.log(url.replace('%20', '-')) //replacing %20 with das(-)
console.log(url.includes('google')) //it tells that string(google) is present in url or not

console.log(gameName.split('-'));