import React from '../core/React.js'

function Counter({ num }) {
  return (
    <div>
      counter { num }
    </div>
  )
}

const App = (
  <div id="app">
    <div>hi-mini-react</div>
    <Counter num={10} />
  </div>
)

export default App
