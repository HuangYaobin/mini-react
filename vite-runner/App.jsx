import React from '../core/React.js'

let visible = true

function Controller() {
  function handleVisible() {
    visible = !visible
    React.update()
  }
  return <button onClick={handleVisible}>
    开关
  </button>
}

function Open() {
  return <div>已打开</div>
}

function Close() {
  return <div>已关闭</div>
}

function App() {
  return(
    <div id="app">
      <div>hi-mini-react</div>
      <Controller />
      <div>
        { visible  ? <Open /> : <Close /> }      
      </div>
    </div>
  )
}

export default App
