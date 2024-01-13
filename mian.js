const root = document.getElementById('root')

const appNode = document.createElement('div')
appNode.setAttribute('id', 'app')

const textNode = document.createTextNode('hi-mini-react')

appNode.appendChild(textNode)

root.appendChild(appNode)
