import Dep from "./dep.js"

export default function Watcher(cb) {
  this.cb = []
  this.cb.push(cb)
  Dep.target = this
  cb()
  Dep.target = null
}

Watcher.prototype.update = function() {
  this.cb.forEach(cb => cb())
}