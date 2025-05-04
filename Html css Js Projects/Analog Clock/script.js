let hourLine = document.querySelector("#hour");
let minLine = document.querySelector("#min");
let secLine = document.querySelector("#sec");

function displayTime() {
    let dateIs = new Date()
    //getting hour, min and sec
    let hourIs = dateIs.getHours();
    let minsIs = dateIs.getMinutes();
    let secondIs = dateIs.getSeconds();

    //rotations
    let hourRotation = hourIs * 30 + minsIs/2;
    let minsRotation = minsIs * 6
    let secRotation = secondIs * 6

    //rotating
    hourLine.style.transform = `rotate(${hourRotation}deg)`
    minLine.style.transform = `rotate(${minsRotation}deg)`
    secLine.style.transform = `rotate(${secRotation}deg)`
}

setInterval(displayTime, 1000)

// setInterval(() => {
//     displayTime()
// }, 1000);