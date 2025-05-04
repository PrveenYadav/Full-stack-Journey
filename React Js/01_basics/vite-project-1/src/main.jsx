import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
// import App from './hello.jsx' //importing the hello.jsx file
import App from './hello1.jsx'

// const reactElement = React.createElement(
//   'a',
//   {href: 'https://google.com', target: '_blanck'},
//   'click me to open google'
// )

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
