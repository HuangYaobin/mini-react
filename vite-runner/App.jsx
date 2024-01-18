import React from '../core/React.js'

let visible = true

function Controller() {
  function handleVisible() {
    visible = !visible
    React.update()
  }
  
  const open = (
    <div>
      <span style="font-weight: bold;">状态:</span>
      <span>已打开</span>
      <span>!!!</span>
      <span>...</span>
    </div>
  )
  const close = (
    <div>
      <span>已关闭</span>
    </div>
  )

  return <div>
    <button onClick={handleVisible}>
      开关
    </button>
    { visible  ? open : close }
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
