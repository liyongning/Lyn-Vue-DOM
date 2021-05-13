import Watcher from "./watcher.js"

export default function mount(vm) {
  const el = document.querySelector(vm.$options.el) || document.createElement('div')
  compilerNode(el, vm)
}

function compilerNode(node, vm) {
  node.childNodes.forEach(node => {
    if (node.nodeType === 1) {
      // 编译节点的属性节点
      compilerAttrs(node, Array.from(node.attributes), vm)
      // 递归编译子节点
      compilerNode(node, vm)
    } else if (node.nodeType === 3) {
      // 文本节点
      parseText(node, vm)
    }
  })
}

function parseText(node, vm) {
  if (node.textContent.match(/{{(.*)}}/)) {
    // key 为 this.key 中的 key
    const key = RegExp.$1.trim()
    function cb() {
      node.textContent = typeof vm[key] === 'object' ? JSON.stringify(vm[key]) : String(vm[key])
    }
    new Watcher(cb)
  }
}

function compilerAttrs(node, attrs, vm) {
  for (let i = 0, len = attrs.length; i < len; i++) {
    const { name, value } = attrs[i]
    if (name.match(/^v-bind:(.*)/)) {
      // <div v-bind:title="test" />
      parseVBind(node, RegExp.$1, value, vm)
    }
    if (name.match(/^v-model/)) {
      // <input v-model="test" />
      parseVModel(node, value, vm)
    }
    if (name.match(/^v-on:(.*)/)) {
      // <button v-on:click="test"></button>
      parseVOn(node, RegExp.$1, value, vm)
    }
  }
}

function parseVBind(node, attrName, attrValue, vm) {
  function cb() {
    node.setAttribute(attrName, vm[attrValue])
  }
  new Watcher(cb)
}

function parseVOn(node, eventName, eventValue, vm) {
  function cb() {
    node.addEventListener(eventName, function(...args) {
      vm.$options.methods[eventValue].apply(vm, args)
    })
  }
  new Watcher(cb)
}

function parseVModel(node, key, vm) {
  const { tagName, type } = node
  if (type === 'text' || tagName.toLowerCase() === 'textarea') {
    // <input v-model="test" type="text" /> 或者 <textarea v-model="test" />
    node.value = vm[key]
    // 监听 input 事件，动态改变 this.key
    node.addEventListener('input', function() {
      vm[key] = node.value
    })
  } else if (type === 'radio' || type === 'checkbox') {
    // <input type="radio|checkbox" v-model="test" />
    node.checked = vm[key]
    node.addEventListener('change', function() {
      vm[key] = node.checked
    })
  } else if (tagName.toLowerCase() === 'select') {
    // <select></select>
    node.value = vm[key]
    node.addEventListener('change', function() {
      vm[key] = node.value
    })
  }
}