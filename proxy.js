export default function proxy(target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get() {
      return target[sourceKey][key]
    },
    set(newV) {
      target[sourceKey][key] = newV
    }
  })
}