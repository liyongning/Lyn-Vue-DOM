// import mount from "./compiler.js"
import mount from "./compiler/index.js"
import defineReactive from "./defineReactive.js"
import initData from "./initData.js"

export default function Vue(options) {
  this.$options = options
  // 处理 data
  initData(this)
  if (this.$options.el) {
    this.$mount(this)
  }
}

Vue.set = function (obj, key, val) {
  defineReactive(obj, key, val)
}

Vue.prototype.$mount = function(vm) {
  mount(vm)
}