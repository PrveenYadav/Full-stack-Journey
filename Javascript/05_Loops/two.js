let i = 0; 
while(i <= 10) {
    console.log(`Value is: ${i}`)
    i += 2
}

// let score = 1
let score = 11
do {
    console.log(`Score is ${score}`)
    score++
} while (score <= 10);

//For of loop
let arr = [1, 2, 3, 4, 5]

for (const val of arr) {
    console.log(val)
}

// Map: Is a Object holds key value pairs and gives unique values
const map = new Map()

map.set("IN", "India")
map.set("USA", "United States of America")
map.set("UK", "United Kingdom")
console.log(map)

for(const i of map) {
    console.log(i)
}
for(const [key, val] of map) {
    console.log(key, ':-', val)
}

//for in loop
const myObject = {
    js: "JavaScript",
    py: "Python",
    cpp: "C++",
    rb: "Ruby"
}

for (const key in myObject) {
    console.log(key)
}
for (const key in myObject) {
    console.log(`${key} extension is for ${myObject[key]}`)
}

//for in loop on array gives the indexes while for of loop gives values/elements
const programming = ["cpp", "java", "javascript", "python"]
for (const key in programming) {
    console.log(key)
}
for (const key in programming) {
    console.log(programming[key]) //to access values
}


//For each loop
const newArr = [1, 2, 3, 4, 5]
const newArr1 = ["Rahul", "Arnav", "Bipul", "Hitesh", "Ramesh"]

newArr.forEach( function(val) {
   console.log(val) 
})

newArr1.forEach(element => {
   console.log(element) 
})

newArr1.forEach( (val, index, arr) => {
    console.log(val, index, arr);
})

const arrNew = [
    {
        herosName: "IronMan",
        score: 92
    },
    {
        herosName: "Thor",
        score: 97
    },
    {
        herosName: "Captain America",
        score: 90
    },
]

arrNew.forEach( (items) => {
    console.log(items.herosName)
})


//Filter
const myNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const values = myNum.filter( (num) => num > 5)
//or like this
const values1 = myNum.filter( (num) => {
    return num > 5
})

console.log(values)
console.log(values1)

//or using for each loop
const newNum = []
myNum.forEach( num => {
    if(num > 5) newNum.push(num)
})
console.log(newNum)