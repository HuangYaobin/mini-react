export function render (el, container) {
  const dom = el.type === 'TEXT_ELEMENT'
    ? document.createTextNode(el.props.nodeValue)
    : document.createElement(el.type)

  Object.entries(el.props).forEach(([key, value]) => {
    if (key !== 'children') {
      dom[key] = value
    }
  })

  el.props.children.forEach(el => render(el, dom))

  container.appendChild(dom)
}
