const accountId = 12345 //constants: you can't change it
let email = "abc@google.com"
var password = "888888" //Now we should only use let not var(old version)
city = "Jaipur" //we can also write without difining variable, but it is bad practice

console.log(accountId)

//make changes in all variables except const
email = "bbb.com"
password = "222222"
city = "Delhi"

/*
Prefer not to use var
because of issue in block scope and functional scope
*/

console.table([email, password, city]); //prints multiple values in the form of table