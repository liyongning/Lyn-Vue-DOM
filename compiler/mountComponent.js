import Watcher from '../watcher.js'

export default function mountComponent(vm) {
  const updateComponent = function() {
    vm._update(vm._render())
  }
  new Watcher(updateComponent)
}