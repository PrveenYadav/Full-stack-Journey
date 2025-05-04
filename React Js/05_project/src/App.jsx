import { useState } from 'react'
import InputBox from './components/InputBox.jsx'
import useCurrencyInfo from './hooks/useCurrencyInfo'
import './App.css'

function App() {
  const [amount, setAmount] = useState(0)
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("inr")
  const [convertedAmount, setConvertedAmount] = useState(0)

  const currencyInfo = useCurrencyInfo(from)
  const options = Object.keys(currencyInfo)

  const swap = () => {
    setFrom(to)
    setTo(from)
    setAmount(convertedAmount)
    setConvertedAmount(amount)
  }

  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to])
  }

  return (
    <div 
      className='w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat '
      style={{
        backgroundImage: `url("./src/two.jpg")`, height: "90vh",
      }}
      >

      <div className='w-full'>
        <div className='w-full max-w-md mx-auto rounded-lg p-8 backdrop-blur-sm bg-white/10 '>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert()
            }}
            >

            <div className='w-full mb-1 '>
              <InputBox 
                label="From" 
                amount={amount} 
                currencyOptions = {options}
                onCurrencyChange={(currency) => {setAmount(amount)}}
                selectCurrency={from}
                onAmountChange={(amount) => setAmount(amount)}
                />
            </div>

            <div className='relative w-full h-0.5 '>
              <button
                type='button'
                className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-600 text-white px-3 py-1 cursor-pointer '
                onClick={swap}
                >
                swap
              </button>
            </div>

            <div className='w-full mt-1 mb-4 '>
              <InputBox
                label="To"
                amount={convertedAmount} 
                currencyOptions = {options}
                onCurrencyChange={(currency) => setTo(currency)}
                selectCurrency={from}
                amountDisable
              />
            </div>

            <button type='submit' className='w-full bg-blue-600 text-white px-4 py-3 rounded-lg cursor-pointer '>
              Convert {from.toUpperCase()} to {to.toUpperCase()}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default App