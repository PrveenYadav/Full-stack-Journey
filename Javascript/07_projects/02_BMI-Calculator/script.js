const form = document.querySelector('form')

form.addEventListener('submit', function(e) {
    e.preventDefault();

    //extracting the value of height in Numbers(because it gives in string)
    const height = parseInt(document.querySelector('#height').value)
    const weight = parseInt(document.querySelector('#weight').value)
    const result = document.querySelector('.result')

    if(height == '' || height < 0 || isNaN(height)) {
        result.innerHTML = `Pleave give a valid Height: ${height}`
        result.style.padding = "15px"
    }
    else if(weight == '' || weight < 0 || isNaN(weight)) {
        result.innerHTML = `Pleave give a valid Weight: ${weight}`
        result.style.padding = "15px"
    }
    else {
        const bmi = (weight / ((height*height) / 10000)).toFixed(2);
        result.innerHTML = `<span>Body Mass Index: ${bmi}</span>`;
        result.style.padding = "15px"
            
        const under = document.querySelector('#p1')
        const normal = document.querySelector('#p2')
        const over = document.querySelector('#p3')
        if(bmi < 18.6) {
            under.style.display = "block"
            under.style.color = "red"
        }
        else if(bmi >= 18.6 && bmi <= 24.9) {
            normal.style.display = "block"
            normal.style.color = "#67e871"
        }
        else {
            over.style.display = "block"
            over.style.color = "red"
        }
    }
})