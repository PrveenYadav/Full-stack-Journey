require('dotenv').config()

const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/about', (req, res) => {
    res.send('<h1> Congratulation You have made a server successfully</h1>')
})

app.get('/youtube', (req, res) => {
    res.send("<a href='https://www.youtube.com/@Prveen_yadav'>Youtube</a>")
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})
