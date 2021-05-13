import genElement from "./genElement.js";
import parseRawAttr from "./parseRawAttr.js";
import vnode from "./vnode.js";

export default function mount(vm) {
  let el = vm.$options.el
  if (el) {
    el = document.querySelector(el)
  } else {
    el = document.createElement('div')
  }
  vm.$el = el

  const ast = parse(el)
  const code = generate(ast)
  vm.$options.render = code
}

function parse(node) {
  const elm = vnode(node)
  if (elm.type === 1) {
    // 元素节点
    parseRawAttr(elm)
  }
  const { childNodes } = node
  for (let i = 0, len = childNodes.length; i < len; i++) {
    const { nodeType, textContent } = childNodes[i]
    if (nodeType === 3 && !textContent.trim()) continue
    const childElm = parse(childNodes[i])
    elm.children.push(childElm)
    childElm.parent = elm
  }
  return elm
}

function generate(ast) {
  const code = ast ? genElement(ast) : '_c("div")'
  return new Function(`with(this){return ${code}}`)
}