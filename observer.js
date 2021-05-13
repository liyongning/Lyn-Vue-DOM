import defineReactive from "./defineReactive.js"
import observe from "./observe.js"
import protoArgument, { arrayMethods } from "./array.js"
import Dep from "./dep.js"

export default function Observer(value) {
  this.dep = new Dep()
  Object.defineProperty(value, '__ob__', {
    value: this,
    enumerable: false,
    writable: true,
    configurable: true
  })

  if (Array.isArray(value)) {
    // 数组响应式
    protoArgument(value, arrayMethods)
    this.observeArray(value)
  } else {
    // 对象响应式
    this.walk(value)
  }
}

Observer.prototype.walk = function(value) {
  for(let key in value) {
    defineReactive(value, key, value[key])
  }
}

// 处理数组元素为对象的情况
Observer.prototype.observeArray = function(value) {
  for (let i = 0, len = value.length; i < len; i++) {
    observe(value[i])
  }
}