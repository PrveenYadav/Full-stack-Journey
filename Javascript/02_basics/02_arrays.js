const marvel_heroes = ["Thor", "Ironman", "Spiderman"]
const dc_heroes = ["Batman", "Superman", "Glace"]
//concate using Push
console.log(marvel_heroes.push(dc_heroes))
console.log(marvel_heroes)
console.log(marvel_heroes[3])
console.log(marvel_heroes[3][1])

//concate
const marvel_heroes1 = ["Thor", "Ironman", "Spiderman"]
const allHeroes = marvel_heroes1.concat(dc_heroes)
console.log(allHeroes);

//spread: also use to concate
const all_new_heroes = [...marvel_heroes1, ...dc_heroes]
console.log(all_new_heroes)

//flat
const another_array = [1, 2, [3, 4], 5, 7, [6, 8, [2, 9], 4, 5],6]
console.log(another_array)
const real_array = another_array.flat(Infinity) //infinity or you can write how dept you want like depth is 3 of above array
console.log(real_array) 

console.log(Array.isArray("Akash"))
console.log(Array.from("Hitesh"))

let score1 = 100
let score2 = 200
let score3 = 300
console.log(Array.of(score1, score2, score3))