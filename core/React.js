let nextUnitOfWork
let rootUnitOfWork

export function render (el, container) {
  nextUnitOfWork = {
    props: {
      children: [el]
    },
    dom: container,
    child: null,
    sibling: null,
    parent: null,
  }
  rootUnitOfWork = nextUnitOfWork
}

function workLoop (IdleDeadline) {
  let shouldYield = IdleDeadline.timeRemaining() < 1

  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

    shouldYield = IdleDeadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && rootUnitOfWork) {
    commitRoot(rootUnitOfWork)
    rootUnitOfWork = null
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function commitRoot (root) {
  commitWork(root.child)
}

function commitWork (fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.dom) {
    fiberParent.dom.appendChild(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function performUnitOfWork (fiber) {
  const isFunctionComponent = typeof fiber.type === 'function'
  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

function updateFunctionComponent (fiber) {
  const children = [fiber.type(fiber.props)]
  initChildren(fiber, children)
}

function updateHostComponent (fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber.type)
    updateProps(dom, fiber.props)
  }

  const children = fiber.props.children
  initChildren(fiber, children)
}

function createDom (type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
}

function updateProps (dom, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key !== 'children') {
      if (key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase()
        dom.addEventListener(eventType, value)
      } else {
        dom[key] = value
      }
    }
  })
}

function initChildren (fiber, children) {
  let preFiber = null
  children.forEach((child, index) => {
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
}

export function createElement (type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode = ['string', 'number'].includes(typeof child)
        return isTextNode ? createTextNode(child) : child
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


