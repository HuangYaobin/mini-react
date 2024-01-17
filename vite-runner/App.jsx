import React from '../core/React.js'

function Counter({ num }) {
  function handleClick() {
    console.log('click')
  }
  return (
    <div>
      <div>counter { num }</div>
      <button onClick={handleClick}>点击</button>
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
