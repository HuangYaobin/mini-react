export function render (el, container) {
  workLoop(el, container)
}

function workLoop (el, container) {
  let nextUnitOfWork = {
    props: {
      children: [el]
    },
    dom: container,
    child: null,
    sibling: null,
    parent: null,
  }
  let rootUnitOfWork = nextUnitOfWork

  requestIdleCallback(
    function work (IdleDeadline) {
      let shouldYield = IdleDeadline.timeRemaining() < 1

      while (!shouldYield && nextUnitOfWork) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)

        shouldYield = IdleDeadline.timeRemaining() < 1
      }

      if (!nextUnitOfWork && rootUnitOfWork) {
        commitRoot(rootUnitOfWork)
        rootUnitOfWork = null
      }

      requestIdleCallback(work)
    }
  )
}

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
  if (!fiber.dom) {
    if (!isFunctionComponent) {
      const dom = fiber.dom = createDom(fiber.type)

      updateProps(dom, fiber.props)
    }
  }

  const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children
  initChildren(fiber, children)

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }
}

function createDom (type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
}

function updateProps (dom, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key !== 'children') {
      dom[key] = value
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


