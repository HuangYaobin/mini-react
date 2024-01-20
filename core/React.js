// work in progress root
let wipRoot
let nextUnitOfWork
let wipFiber
let deletions = []

export function render (el, container) {
  wipRoot = {
    props: {
      children: [el]
    },
    dom: container,
    child: null,
    sibling: null,
    parent: null,
  }
  nextUnitOfWork = wipRoot
}

export function update () {
  const currentFiber = wipFiber

  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextUnitOfWork = wipRoot
  }
}

function workLoop (IdleDeadline) {
  let shouldYield = IdleDeadline.timeRemaining() < 1

  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    if (wipRoot?.sibling?.type === nextUnitOfWork?.type) {
      nextUnitOfWork = null
    }

    shouldYield = IdleDeadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function commitRoot () {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  wipRoot = null
  deletions = []
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

function commitDeletion (fiber) {
  if (!fiber) return
  if (!fiber.dom) return commitDeletion(fiber.child)
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  fiberParent.dom.removeChild(fiber.dom)
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
  wipFiber = fiber
  stateHooks = []
  stateHooksIndex = 0
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

function updateHostComponent (fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber.type)
    updateProps(dom, fiber.props)
  }

  const children = fiber.props.children
  reconcileChildren(fiber, children)
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

function reconcileChildren (fiber, children) {
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
      if (child) {
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
        deletions.push(oldChildFiber)
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

    if (newChildFiber) {
      preChildFiber = newChildFiber
    }
  })

  while (oldChildFiber) {
    deletions.push(oldChildFiber)
    oldChildFiber = oldChildFiber.sibling
  }
}

let stateHooks = []
let stateHooksIndex = 0
export function useState (initialState) {
  const currentFiber = wipFiber
  const oldFiber = currentFiber.alternate

  const oldStateHook = oldFiber?.stateHooks?.[stateHooksIndex]
  const stateHook = {
    state: oldStateHook?.state || initialState,
    queue: []
  }

  oldStateHook?.queue.forEach(action => stateHook.state = action(stateHook.state))

  stateHooksIndex++
  stateHooks.push(stateHook)

  currentFiber.stateHooks = stateHooks

  function setState (action) {
    stateHook.queue.push(typeof action === 'function' ? action : () => action)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextUnitOfWork = wipRoot
  }

  return [
    stateHook.state,
    setState
  ]
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
  useState,
  createElement
}

export default React


