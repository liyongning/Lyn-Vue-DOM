import Dep from "./dep.js"

export default function Watcher(vm, cb, options) {
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
  this.getter.call(this.vm)
  if (this.options.lazy) {
    this.dirty = true
  }
}

Watcher.prototype.evalute = function () {
  this.value = this.get()
  this.dirty = false
}