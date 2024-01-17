let nextUnitOfWork
let rootUnitOfWork
let currentRootUnitOfWork

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

export function update () {
  nextUnitOfWork = {
    props: currentRootUnitOfWork.props,
    dom: currentRootUnitOfWork.dom,
    child: null,
    sibling: null,
    parent: null,
    alternate: currentRootUnitOfWork
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
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function commitRoot () {
  commitWork(rootUnitOfWork.child)
  currentRootUnitOfWork = rootUnitOfWork
  rootUnitOfWork = null
}

function commitWork (fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate.props)
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.appendChild(fiber.dom)
    }
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

function updateProps (dom, nextProps, prevProps = {}) {
  Object.keys(prevProps).forEach((key) => {
    if (key === 'children') return
    if ((key in nextProps)) return
    dom.removeAttribute(key)
  })

  Object.entries(nextProps).forEach(([key, value]) => {
    if (key === 'children') return
    if (value === prevProps[key]) return
    if (key.startsWith('on')) {
      const eventType = key.slice(2).toLowerCase()
      dom.removeEventListener(eventType, prevProps[key])
      dom.addEventListener(eventType, value)
    } else {
      dom[key] = value
    }
  })
}

function initChildren (fiber, children) {
  let preChildFiber = null
  let oldChildFiber = fiber.alternate?.child

  children.forEach((child, index) => {
    const isSameType = oldChildFiber?.type === child.type

    let newChildFiber
    if (isSameType) {
      newChildFiber = {
        type: child.type,
        props: child.props,
        dom: oldChildFiber.dom,
        child: null,
        sibling: null,
        parent: fiber,
        alternate: oldChildFiber,
        effectTag: 'update'
      }
    } else {
      newChildFiber = {
        type: child.type,
        props: child.props,
        dom: null,
        child: null,
        sibling: null,
        parent: fiber,
        effectTag: 'placement'
      }

    }

    if (oldChildFiber) {
      oldChildFiber = oldChildFiber.sibling
    }

    if (index === 0) {
      fiber.child = newChildFiber
    } else {
      preChildFiber.sibling = newChildFiber
    }

    preChildFiber = newChildFiber
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
  update,
  createElement
}

export default React


