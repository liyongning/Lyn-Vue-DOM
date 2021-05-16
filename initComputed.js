import Watcher from "./watcher.js"

export default function initComputed(vm) {
  vm._computed = vm.$options.computed
  const watchers = vm._computedWatchers = Object.create(null)
  for (let property in vm._computed) {
    watchers[property] = new Watcher(vm, vm._computed[property], { lazy: true })
    defineComputed(vm ,property)
  }
}

function defineComputed(vm, key) {
  Object.defineProperty(vm, key, {
    get() {
      const watcher = vm._computedWatchers && vm._computedWatchers[key]
      if (watcher) {
        // 实现 computed 缓存
        if (watcher.dirty) {
          watcher.evalute()
        }
        return watcher.value
      }
    }
  })
}