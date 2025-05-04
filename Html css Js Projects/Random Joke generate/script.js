const para = document.querySelector('#joke')
const btn = document.querySelector('#btn')
const url = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,explicit&type=single";


let getJoke = () => {
    para.classList.remove("fade");
    fetch(url)
    .then(data => data.json())
    .then(item => {
        para.textContent = `${item.joke}`;
        para.classList.add("fade");
    });
}

btn.addEventListener('click', getJoke);
getJoke();