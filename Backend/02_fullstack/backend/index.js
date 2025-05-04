// const express = require('express')  //this is the common js syntax 

//it is the modern module js syntax to use it we add it in package.json
import express from 'express'

const app = express();

app.use(express.static('dist'));

app.get('/', (req, res) => {
    res.send('File is Ready');
})

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: 'A Joke',
            content: 'This is a joke'
        },
        {
            id: 2,
            title: 'Second Joke',
            content: 'This is another joke'
        },
        {
            id: 3,
            title: 'Third Joke',
            content: 'This is a joke'
        },
        {
            id: 4,
            title: 'Fourth Joke',
            content: 'This is a joke'
        },
        {
            id: 5,
            title: 'Fifth Joke',
            content: 'This is a joke'
        },
    ]

    res.send(jokes);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
})