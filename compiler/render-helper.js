import VNode from "./vnode.js"

export default function renderHelper(target) {
  target._c = createElement
  target._v = createTextVNode
}

function createElement(tag, attr, children) {
  return new VNode(tag, attr, children, '', this)
}

function createTextVNode(text) {
  return new VNode('', {}, [], typeof text === 'object' ? JSON.stringify(text) : String(text), this)
}