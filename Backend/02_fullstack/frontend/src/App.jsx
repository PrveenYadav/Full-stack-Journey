import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios' //we are installing new library for web request better than fetch => npm i axios

function App() {
  const[jokes, setJokes] = useState([])

  //Esier and better and most used than using fetch(in fetch we parse data in json etc but in axios it takes cares of it itself)

  //proxy is the solution of CORS error => browser not allow every request
  useEffect(() => {
    axios.get('/api/jokes') //instead of using full url we used "proxy" (in vite.config file) because we don't in given url port:3000 is not available in another device.
      .then((response) => {
        setJokes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  return (
    <>
      <h1>Full Stack Project : How to connect frontend with backend</h1>
      <p>JOKES: {jokes.length}</p>

      {
        jokes.map((joke, index) => (
          <div key={joke.id}>
            <h3>{joke.title}</h3>
            <p>{joke.content}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
