import React from '../core/React.js'

function Counter({ num }) {
  return (
    <div>
      counter { num }
    </div>
  )
}

function App() {
  return(
    <div id="app">
      <div>hi-mini-react</div>
      <Counter num={10} />
      <Counter num={20} />
    </div>
  )
}

export default App
