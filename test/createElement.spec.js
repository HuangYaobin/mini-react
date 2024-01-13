import { describe, it, expect } from 'vitest'
import { createElement } from '../core/React'

describe('createElement', () => {
  it('没有属性', () => {
    const el = createElement('div')

    expect(el).toEqual({
      type: 'div',
      props: {
        children: []
      }
    })
  })

  it('没有子元素', () => {
    const el = createElement('div', { id: 'app' })

    expect(el).toEqual({
      type: 'div',
      props: {
        id: 'app',
        children: []
      },
    })
  })

  it('有文本节点', () => {
    const el = createElement('div', { id: 'app' }, 'text')

    expect(el).toEqual({
      type: 'div',
      props: {
        id: 'app',
        children: [{
          type: 'TEXT_ELEMENT',
          props: {
            nodeValue: 'text',
            children: []
          }
        }]
      },
    })
  })
})
