//Project: Password Generator

import { useState, useCallback, useEffect, useRef } from 'react' //useState hook, useCallback hook, useEffect hook, useRef hook

function NewApp() {
  const [length, setLength] = useState(8)
  const [numAllowed, setNumAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassoword] = useState("")

  // useRef hook
  const passwordRef = useRef(null)

  //syntax of useCallback : const pass = useCallback(fn, []) where first is function and second is array of dependencies
  const passwordGenerator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if(numAllowed) str += "123456789"
    if(charAllowed) str += "@#$&*_-.!"

    for(let i=1; i<=length; i++) {
        let char = Math.floor(Math.random() * str.length + 1)
        pass += str.charAt(char)
    }
    setPassoword(pass)

  }, [length, numAllowed, charAllowed])

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select()
    // passwordRef.current?.setSelectionRange(0, 3);  //use to select in range
    window.navigator.clipboard.writeText(password)
  }, [password])

  //Syntax of useEffect hook: useEffect(() => {}, []) where first is callback and second is array of dependencies
  useEffect(() => {
    passwordGenerator()
  }, [length, numAllowed, charAllowed, passwordGenerator])

  return (
    <>
        <div className='w-full max-w-md mx-auto my-8 px-4 py-5 shadow-md rounded-lg text-orange-500 bg-gray-700'>
            <h1 className='text-white text-center my-3 text-2xl '>Password Generator</h1>
            <div className='flex shadow rounded-lg overflow-hidden mb-4'>
                <input type="text" 
                    value={password} 
                    className='outline-none w-full py-1 px-3 bg-white '
                    placeholder='Password'
                    readOnly
                    ref={passwordRef}
                />
                <button 
                    onClick={copyPasswordToClipboard}
                    className='bg-blue-700 text-white outline-none px-3 shrink-0 cursor-pointer '>
                    copy
                </button>
            </div>
            <div className='flex text-sm gap-x-2'>
                <div className='flex items-center gap-x-2 '>
                    <input 
                        type="range"
                        min={5}
                        max={20} 
                        value={length}
                        className='cursor-pointer '
                        onChange={(e) => {setLength(e.target.value)}}
                    />
                    <label>Length: {length}</label>
                </div>
                <div className='flex items-center gap-x-2 '>
                    <input 
                        type="checkbox" 
                        defaultChecked={numAllowed}
                        id='number-input'
                        onChange={() => {setNumAllowed((prev) => !prev)}}
                    />
                    <label htmlFor="number-input">Numbers</label>
                </div>
                <div className='flex items-center gap-x-2 '>
                    <input 
                        type="checkbox" 
                        defaultChecked={numAllowed}
                        id='number-input'
                        onChange={() => {setCharAllowed((prev) => !prev)}}
                    />
                    <label htmlFor="number-input">Characters</label>
                </div>
            </div>
        </div>
    </>
  )
}

export default NewApp