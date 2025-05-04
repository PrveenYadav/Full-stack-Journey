// Reduce
const myNum = [1, 2, 3]

// acc = acumalator, currVal = current value, 0 = initial value
const total =  myNum.reduce( function(acc, currVal) {
    console.log(`Accumalator: ${acc} and Current Value: ${currVal}`)
    return acc + currVal
}, 0)

console.log(total)

//Using arrow function
const myTotal = myNum.reduce( (acc, currVal) => acc+currVal, 0)
console.log(myTotal)


const shoppingCart = [
    {
        courseName: "JavaScript course",
        price: 1999
    },
    {
        courseName: "AI ML course",
        price: 2999
    },
    {
        courseName: "Python course",
        price: 1500
    },
]

const priceToPay = shoppingCart.reduce( (acc, item) => acc + item.price, 0)
console.log(priceToPay)