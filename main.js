import { createElement } from './createElement.js'
import { render } from './render.js'

render(
  createElement(
    'div', { id: 'app' },
    'hi-mini-react',
  ),
  document.getElementById('root')
)

