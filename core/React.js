export function render (el, container) {
  workLoop(el, container)
}

function workLoop (el, container) {
  let nextWorkOfUnit = {
    props: {
      children: [el]
    },
    dom: container,
    child: null,
    sibling: null,
    parent: null,
  }

  requestIdleCallback(
    function work (IdleDeadline) {
      let shouldYield = IdleDeadline.timeRemaining() < 1

      while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)

        shouldYield = IdleDeadline.timeRemaining() < 1
      }

      requestIdleCallback(work)
    }
  )
}

function performWorkOfUnit (fiber) {
  if (!fiber.dom) {
    const dom = (
      fiber.dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode(fiber.props.nodeValue)
        : document.createElement(fiber.type)
    )

    Object.entries(fiber.props).forEach(([key, value]) => {
      if (key !== 'children') {
        dom[key] = value
      }
    })

    fiber.parent?.dom.appendChild(dom)
  }

  let preFiber = null
  fiber.props.children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      dom: null,
      child: null,
      sibling: null,
      parent: fiber,
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      preFiber.sibling = newFiber
    }

    preFiber = newFiber
  })

  if (fiber.child) {
    return fiber.child
  }

  if (fiber.sibling) {
    return fiber.sibling
  }

  // 要递归找叔叔?
  return fiber.parent?.sibling
}


export function createElement (type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child
      })
    },

  }
}

function createTextNode (text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    }
  }
}

const React = {
  render,
  createElement
}

export default React


