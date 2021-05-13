export default function installRenderHelper(target) {
  target._c = createElement
  target._v = createTextNode
  target._s = toString
}

function createElement(tag, attr, children) {
  const elm = document.createElement(tag)
  for (let name in attr) {
    elm.setAttribute(name, attr[name])
  }
  for (let child of children) {
    elm.appendChild(child)
  }
  return elm
}

function createTextNode(text) {
  return document.createTextNode(text)
}

function toString(value) {
  return value
}