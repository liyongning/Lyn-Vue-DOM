export default function Dep() {
  this.watchers = []
}

Dep.prototype.depend = function() {
  if (Dep.target && !this.watchers.includes(Dep.target)) {
    this.watchers.push(Dep.target)
  }
}

Dep.prototype.notify = function() {
  for(let i = 0, len = this.watchers.length; i < len; i++) {
    this.watchers[i].update()
  }
}