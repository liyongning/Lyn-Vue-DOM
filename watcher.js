import { queueWatcher } from "./asyncUpdateQueue.js"
import Dep from "./dep.js"

let uid = 0

export default function Watcher(vm, cb, options) {
  this.id = uid++
  this.vm = vm
  this.options = options || {}
  this.getter = cb
  this.value = this.options.lazy ? undefined : this.get()
  this.dirty = this.options.lazy
}

Watcher.prototype.get = function () {
  Dep.target = this
  const value = this.getter.call(this.vm)
  Dep.target = null
  return value
}

Watcher.prototype.update = function () {
  if (this.options.lazy) {
    this.dirty = true
  } else {
    // 将 watcher 入队
    queueWatcher(this)
  }
}

Watcher.prototype.run = function () {
  const value = this.get()
  if (value !== this.value) {
    this.value = value
  }
}

Watcher.prototype.evalute = function () {
  this.value = this.get()
  this.dirty = false
}