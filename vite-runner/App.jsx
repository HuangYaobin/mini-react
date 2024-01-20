import React,  {  useState } from '../core/React.js'

function Foo() {
  console.log('Foo reRender')
  const [count, setCount] = useState(1)
  const [str, setStr] = useState('hello')

  function handleClick()   {
    add()
    addStr()
  }
  function add() {
    setCount((n) => n+1)
  }
  function addStr() {
    setStr((str) => str + '!')
  }
  return (
    <div>
      <div>FooCounter: {count} </div>
      <div>FooStr: {str} </div>
      <button onClick={handleClick}>点击</button>
    </div>
  )
}

function App() {
  console.log('App reRender')
  
  return(
    <div id="app">
      <div>hi-mini-react</div>
      <Foo />
    </div>
  )
}

export default App
