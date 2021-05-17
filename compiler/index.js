import createAstElement from "./ast.js"
import genElement from "./genElement.js"
import mountComponent from "./mountComponent.js"

export default function mount(el) {
  if (el) {
    el = document.querySelector(el)
  } else {
    el = document.createElement('div')
  }
  this.$el = el
  if (!el) {
    // 挂载子组件
    el = document.createRange().createContextualFragment(this.$options.template).firstChild
  }
  const ast = parse(el)
  const { render } = generate(ast)
  this.$options.render = render
  // 编译完成，挂载组件
  mountComponent(this)
}

// 解析节点，得到 ast
function parse(node) {
  const ast = createAstElement(node)
  const { childNodes } = node
  for (let i = 0, len = childNodes.length; i < len; i++) {
    const { nodeType, textContent } = childNodes[i]
    if (nodeType === 3 && !textContent.trim()) continue
    ast.children.push(parse(childNodes[i]))
  }
  return ast
}

// 从 ast 生成得到 vnode 的渲染函数
function generate(ast) {
  const code = ast ? genElement(ast) : `_c('div')`
  return {
    render: new Function(`with(this){return ${code}}`)
  }
}