import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './card.jsx'

function App({price, title}) {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='bg-blue-500 text-black p-4 rounded-xl cursor-pointer '>Tailwind</h1>
      
      <Card price="0.01" title="Bored ape nft accidental" />
      <Card price={0.35} title={"Ape is in tough situation"} />
    </>
  )
}

export default App
