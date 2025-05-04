let randomNumber = parseInt(Math.random()*100+1)

const submitBtn = document.querySelector('#subt')
const userInput = document.querySelector('#guessField') //input comes in string so we need to convert into number so we use parseInt
const guessSlot = document.querySelector('.guesses')
const remainingGuesses = document.querySelector('.remainingGuess')
const lowOrHigh = document.querySelector('.lowOrHigh')
const startOver = document.querySelector('.resultParas')

const p = document.createElement('p')

let prevGuesses = []
let numOfGuess = 1
let playGame = true

if(playGame) {
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        //converting input value into number
        const numIs = parseInt(userInput.value)
        validateGuess(numIs)
    })
}

function validateGuess(guess) {
    if(isNaN(guess)) {
        alert("Please enter a valid number")
    }
    else if(guess < 1) {
        alert("Please enter a number more than 1")
    }
    else if(guess < 1) {
        alert("Please enter a number less than 100")
    }
    else {
        prevGuesses.push(guess)
        if(numOfGuess === 10) {
            displayGuess(guess);
            displayMessage(`Game Over. Random Number was: ${randomNumber}`)
            endGame();
        }
        else {
            displayGuess(guess)
            checkGuess(guess)
        }
    }
}

function checkGuess(guess) {
    if(guess == randomNumber) {
        displayMessage(`You guessed it right`)
        endGame()
    }
    else if(guess < randomNumber){
        displayMessage(`Number is Tooo low`)
    }
    else if(guess > randomNumber){
        displayMessage(`Number is Tooo high`)
    }
}

//Cleanup Function
function displayGuess(guess) {
    userInput.value = ''
    guessSlot.innerHTML += `${guess} `
    numOfGuess++;
    remainingGuesses.innerHTML = `${11-numOfGuess}`
}

function displayMessage(message) {
    lowOrHigh.innerHTML = `<h3>${message}</h3>`
}

function endGame() {
    userInput.value = ''
    userInput.setAttribute('disabled', '')
    playGame = false
    const newGameBtn1 = document.querySelector('#btn2')
    newGameBtn1.style.display = "block"
    newGame()
}



function newGame() {
    const newGameBtn = document.querySelector('#btn2')

    newGameBtn.addEventListener('click', (e) => {
        randomNumber = parseInt(Math.random()*100+1)
        prevGuesses = []
        numOfGuess = 1
        guessSlot.innerHTML = ''
        lowOrHigh.innerHTML = ''
        remainingGuesses.innerHTML = `${11-numOfGuess}`
        userInput.removeAttribute('disabled')
        playGame = true
        newGameBtn.style.display = "none"
    })
}