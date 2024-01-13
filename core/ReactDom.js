import React from './React.js'

function createRoot (root) {
  return {
    render: (App) => React.render(App, root)
  }
}

const ReactDOM = {
  createRoot
}

export default ReactDOM
