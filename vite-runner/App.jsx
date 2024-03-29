import React,  { useState, useEffect } from '../core/React.js'

function Foo() {
  console.log('Foo reRender')
  const [count, setCount] = useState(1)

  useEffect(() => {
    console.log('foo useEffect init')
    return () => console.log('foo useEffect init cleanup')
  }, [])

  useEffect(() => {
    console.log('foo useEffect update')
    return () => console.log('foo useEffect update cleanup')
  }, [count])

  function handleClick()   {
    add()
  }
  function add() {
    setCount(count + 1)
  }
  return (
    <div>
      <div>FooCounter: {count} </div>
      <button onClick={handleClick}>+1</button>
    </div>
  )
}

function Bar() {
  console.log('Bar reRender')
  const [str, setStr] = useState(1)

  useEffect(() => {
    console.log('bar useEffect init')
    return () => console.log('bar useEffect init cleanup')
  }, [])

  useEffect(() => {
    console.log('bar useEffect update')
    return () => console.log('bar useEffect update cleanup')
  }, [str])

  function handleClick()   {
    addStr()
  }
  function addStr() {
    setStr((str) => str + 'i')
  }
  return (
    <div>
      <div>BarStr: { str } </div>
      <button onClick={handleClick}>+!</button>
    </div>
  )
}

function App() {
  console.log('App reRender')
  
  return(
    <div id="app">
      <div>hi-mini-react</div>
      <Foo />
      <Bar />
    </div>
  )
}

export default App
