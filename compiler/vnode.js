export default function VNode(tag, attr, children, text, context) {
  this.tag = tag
  this.attr = attr
  this.children = children
  this.text = text
  // 当前节点的真实节点
  this.elm = null
  this.context = context
}

VNode.prototype.createElement = function (tag, attr, children) {
  const node = document.createElement(tag)
  // 处理众多属性（原生 或者 自定义指令)
  parseAttr(this, node, attr)
  // 处理子节点
  for (let child of children) {
    if (child.text) {
      // 文本节点
      node.appendChild(child.createTextNode(child.text))
    } else {
      // 元素节点
      const { tag, attr, children } = child
      node.appendChild(child.createElement(tag, attr, children))
    }
  }
  this.elm = node
  return node
}

VNode.prototype.createTextNode = function (text) {
  const node = document.createTextNode(text)
  this.elm = node
  return node
}

function parseAttr(vnode, node, attr) {
  for (let attrName in attr) {
    const attrValue = attr[attrName]
    if (attrName.match(/v-model/)) {
      // <tag v-model="test" />
      const tag = node.tagName.toLowerCase()
      if ((tag === 'input' && node.type === 'text') || tag === 'textarea') {
        node.setAttribute('value', vnode.context[attrValue])
        node.addEventListener('input', function (event) {
          vnode.context[attrValue] = event.target.value
        })
      } else if (node.type === 'checkbox' || node.type === 'radio') {
        node.setAttribute('checked', vnode.context[attrValue])
        node.addEventListener('change', function (event) {
          vnode.context[attrValue] = event.target.checked
        })
      } else if (tag === 'select') {
        Promise.resolve().then(() => {
          for (let i = 0, len = node.length; i < len; i++) {
            if (node[i].value.toString() === vnode.context[attrValue].toString()) {
              node[i].selected = true
              break;
            }
          }
        })
        node.addEventListener('change', function (event) {
          vnode.context[attrValue] = event.target.value
        })
      }
    } else if (attrName.match(/v-bind:(.*)/)) {
      // <tag v-bind:title="test" />
      const name = RegExp.$1
      node.setAttribute(name, vnode.context[attrValue])
    } else if (attrName.match(/v-on:(.*)/)) {
      // <tag v-on:click="test" />
      const eventName = RegExp.$1
      node.addEventListener(eventName, vnode.context.$options.methods[attrValue])
    } else {
      node.setAttribute(attrName, attr[attrName])
    }
  }
}