import { useState } from "react";
import "./App.css";

function App() {
  //count is the val at 0 index or a variable and setCount is a function
  //default value is 15
  let [count, setCount] = useState(15); //Hooks: it will propogate ui, it will update variable count everywhere in ui where it exist

  // let count = 15

  const addMe = () => {
    console.log("clicked", count);
    if (count < 20) {
      count = count + 1;
      setCount(count);
    }
  };
  const removeMe = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const addMe1 = () => {
    //if i will call setCount multiple times even thogh count increase +1 only
    //because it send values in batch so then work is same then it updates only one time
    //And to do this work: we write function to increase in updated prevCount
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    //it will increase by three by one click
  };

  return (
    <>
      <h1>Hello it is the second project with React</h1>
      <h2>Count Value: {count}</h2>

      <button onClick={addMe1}>Add me: {count}</button>
      <br />
      <button onClick={removeMe}>Remove me: {count}</button>
    </>
  );
}

export default App;
