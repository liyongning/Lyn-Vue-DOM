const methodsToPatch = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

methodsToPatch.forEach(method => {
  Object.defineProperty(arrayMethods, method, {
    value: function (...args) {
      console.log('array reactive')
      const ret = arrayProto[method].apply(this, args)
      let inserted = []
      switch(method) {
        case 'push':
        case 'unshift':
          inserted = args
          break;
        case 'splice':
          // this.arr.splice(0, 0, 1, 2, 3)
          inserted = args.slice(2)
          break;
      }
      // 响应式
      if (inserted.length) this.__ob__.observeArray(inserted)
      // 依赖通知更新
      this.__ob__.dep.notify()
      return ret
    },
    enumerable: true,
    writable: true,
    configurable: true
  })
})

export default function protoArgument(target, proto) {
  target.__proto__ = proto
}