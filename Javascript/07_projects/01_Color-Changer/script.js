const body = document.querySelector("body")
const buttons = document.querySelectorAll('.button ')

buttons.forEach(function(button) {
    console.log(button)

    button.addEventListener('click', function(e) {
        console.log(e)
        console.log(e.target)
        if(e.target.id == 'black') {
            body.style.backgroundColor = "#212121"
            body.style.color = "#fff"
        }
        else if(e.target.id == 'blue') {
            body.style.backgroundColor = "blue"
            body.style.color = "black"
        }
        else if(e.target.id == 'yellow') {
            body.style.backgroundColor = "yellow"
        }
        else {
            body.style.backgroundColor = "red"
        }
    })
});