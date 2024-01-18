import React from '../core/React.js'

let visible = true

function Controller() {
  function handleVisible() {
    visible = !visible
    React.update()
  }
  
  function Open() {
    return (
      <div>
        <span style="font-weight: bold;">状态:</span>
        <span>已打开</span>
        <span>!!!</span>
        <span>...</span>
      </div>
    )
  }

  return <div>
    <div>Controller</div>
    { visible  && <Open /> }
    <button onClick={handleVisible}>
      开关
    </button>
  </div>
}

function App() {
  return(
    <div id="app">
      <div>hi-mini-react</div>
      <Controller />
    </div>
  )
}

export default App
