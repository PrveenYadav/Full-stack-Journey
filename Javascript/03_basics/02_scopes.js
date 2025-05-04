//globel scope
let a = 300

if(true) { //block level scope
    let a = 10
    const b = 20
    console.log("Inner:", a)
}

console.log(a)
// console.log(b)


//Nested Scope
function one() {
    const username = "Arvind"

    function two() {
        const website = "YouTube"
        console.log(username)
    }

    two()
}

one()