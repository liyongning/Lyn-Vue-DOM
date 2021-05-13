import observe from "./observe.js"
import proxy from "./proxy.js"

export default function initData(vm) {
  let data = vm.$options.data || {}
  vm._data = typeof data === 'function' ? data() : data
  // 代理
  for (let key in vm._data) {
    proxy(vm, '_data', key)
  }
  observe(vm._data)
}