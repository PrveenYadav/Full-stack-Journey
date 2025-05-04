
const books = [
    {title: 'Book one', genre: 'Fiction', publish: 1981, edition: 2004},
    {title: 'Book two', genre: 'Non-Fiction', publish: 1991, edition: 2003},
    {title: 'Book three', genre: 'Science', publish: 1987, edition: 2012},
    {title: 'Book four', genre: 'Fiction', publish: 1973, edition: 2017},
    {title: 'Book five', genre: 'History', publish: 1985, edition: 2002},
    {title: 'Book six', genre: 'Non-Fictino', publish: 1981, edition: 2018},
    {title: 'Book seven', genre: 'Science', publish: 1890, edition: 2019},
    {title: 'Book eight', genre: 'History', publish: 1705, edition: 2001},
    {title: 'Book nine', genre: 'Fiction', publish: 1997, edition: 2021},
    {title: 'Book ten', genre: 'Non-Fiction', publish: 2001, edition: 2014},
];

let userBooks = books.filter((bk) => bk.genre === 'History')
userBooks = books.filter((bk) => bk.publish >= 1995)
userBooks = books.filter((bk) => {
    return bk.publish >= 1995 && bk.genre == 'Fiction'
})

console.log(userBooks)


//map
const myNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const newAns = myNumbers.map( (num) => num + 10)
console.log(newAns)

//channing
const newNums = myNumbers
    .map( (num) => num * 10)
    .map( (num) => num + 1)
    .filter( (num) => num >= 41)

console.log(newNums)