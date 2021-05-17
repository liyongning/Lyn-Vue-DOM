import Vue from '../index.js'

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
  return node
}

VNode.prototype.createTextNode = function (text) {
  const node = document.createTextNode(text)
  return node
}

export function setAttribute(vnode, node, attr) {
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
      node.addEventListener(eventName, function() {
        vnode.context.$options.methods[attrValue].call(vnode.context)
      })
    } else {
      node.setAttribute(attrName, attr[attrName])
    }
  }
}

export function createComponent(parentElm, vnode, refElm) {
  // 组件配置
  const options = vnode.context.$options.components[vnode.tag]
  // 将模版转换成 dom 节点
  const childIns = new Vue(options)
  childIns.$mount('#comp')
  parentElm.insertBefore(childIns._vnode.elm, refElm)
}