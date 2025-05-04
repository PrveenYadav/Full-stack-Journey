//Immediately Invoked Function Expressions (IIFE)
//To prevent from polution of globel scopes we use iife for immedietly invoke 

//we use two parrentheses ()() , fist to declare function and second empty parenthesis to execute/function call

//named iife
(function chai() {
    console.log(`Connected bro`)
})();

//unnammed iife
( () => {
    console.log(`Another one`)
})();

//parameter passed iife
((name) => {
    console.log(`OK Ji, ${name}`)
})("Praveen");

