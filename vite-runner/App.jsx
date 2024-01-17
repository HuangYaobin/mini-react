import React from '../core/React.js'

let num = 1
let counterProps = { style: () => num % 5 === 0 ? 'color:red;' : '' }

function Counter() {
  function handleClick() {
    num++
    React.update()
  }
  return (
    <div>
      <div style={ counterProps.style() }>counter { num }</div>
      <button onClick={handleClick}>+1</button>
    </div>
  )
}

function App() {
  return(
    <div id="app">
      <div>hi-mini-react</div>
      <Counter num={10} />
    </div>
  )
}

export default App
