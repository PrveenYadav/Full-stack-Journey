const input = document.querySelector(".inputBtn")
const buttons = document.querySelectorAll("button")

let string = ""; //to store ans
let arr = Array.from(buttons);

arr.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if(e.target.innerText == '=') {
            string = eval(string); //inbuilt function = eval 
            input.value = string;
        }
        else if(e.target.innerText == 'AC') {
            string = "";
            input.value = string;
        }
        else if (e.target.innerText == 'DEL') {
            string = string.substring(0, string.length-1);
            input.value = string;
        }
        else {
            string += e.target.innerText;
            input.value = string;
        }
    })
})