import React from '../core/React.js'

let fooCount = 1
function FooCounter() {
  console.log('Foo reRender')
  const render = React.update()

  function add() {
    fooCount++
    render()
  }
  return (
    <div>
      <span>FooCounter: {fooCount} </span>
      <button onClick={add}>+1</button>
    </div>
  )
}

let barCount = 1
function BarCounter() {
  console.log('Bar reRender')
  const render = React.update()

  function add() {
    barCount++
    render()
  }
  return (
    <div>
      <span>BarCounter: {barCount} </span>
      <button onClick={add}>+1</button>
    </div>
  )
}

let rootCount = 1
function App() {
  console.log('App reRender')
  const render = React.update()

  function add() {
    rootCount++
    render()
  }
  return(
    <div id="app">
      <div>hi-mini-react</div>
      <span>RootCounter: {rootCount} </span><button onClick={add}>+1</button>
      <FooCounter />
      <BarCounter />
    </div>
  )
}

export default App
