//Random colors generate

//hex values = total 16(0-9 and ABCDEF)
const randomColor = function() {
    const hex = '0123456789ABCDEF';
    let color = '#';
    for(let i=0; i<6; i++) {
        const randomNumber = Math.floor(Math.random() * 16); // generate random number 0 to 16
        color += hex[randomNumber];
    }
    return color;
}
// console.log(randomColor())

let intervalId;
const startChangingColor = function(){
    if(!intervalId) {
        intervalId = setInterval(changeBgColor, 500); //500 == 0.5 sec
    }

    function changeBgColor() {
        document.body.style.backgroundColor = randomColor();
    }
};

const stopChangingColor = function(){
    clearInterval(intervalId);
    intervalId = null;
};

const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
startBtn.addEventListener('click', startChangingColor)
stopBtn.addEventListener('click', stopChangingColor)