import React, { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { ClearCanvasButton } from "./ClearCanvasButton";

function App() {
  const [lastKey, setLastKey] = useState('')


  useEffect(() => {
    document.addEventListener('keydown', keyHandler, true)
  }, [])

  const keyHandler = (event) => {
    console.log(event);
    setLastKey(event.key);
  };

  return (
    <>
    <h1>Hi Geeks!</h1>
        
        <p>Key pressed is: {lastKey}</p>
        <input type="text" onKeyDown={(e) => keyHandler(e)} />
      <Canvas />
      <ClearCanvasButton />
    </>
  );
}

export default App;
