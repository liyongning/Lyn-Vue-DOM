// import mount from "./compiler.js"
import mount from "./compiler/index.js"
import mountComponent from "./compiler/mountComponent.js"
import patch from "./compiler/patch.js"
import installRenderHelper from "./compiler/render-helper.js"
import defineReactive from "./defineReactive.js"
import initData from "./initData.js"

export default function Vue(options) {
  this.$options = options
  // 处理 data
  initData(this)
  // 安装运行时的渲染帮助方法
  installRenderHelper(this)
  // patch
  patch(this)

  if (this.$options.el) {
    this.$mount(this)
  }
}

Vue.set = function (obj, key, val) {
  defineReactive(obj, key, val)
}

Vue.prototype.$mount = function (vm) {
  mount(vm)
  mountComponent(vm)
}

Vue.prototype._update = function (vnode) {
  const prevVnode = this._vnode
  this._vnode = vnode
  if (!prevVnode) {
    // 首次渲染
    this.__patch__(this.$el, vnode)
  } else {
    // 后续更新
    this.__patch__(prevVnode, vnode)
  }
}

Vue.prototype._render = function () {
  return this.$options.render.call(this)
}