import Dep from "./dep.js"
import observe from "./observe.js"

export default function defineReactive(obj, key, val) {
  const dep = new Dep()
  const childOb = observe(val)
  Object.defineProperty(obj, key, {
    get() {
      // 当前 key 被读取时，收集依赖
      if (Dep.target) {
        dep.depend()
        // 如果有 子ob，则顺道一块儿完成依赖收集
        if (childOb) {
          childOb.dep.depend()
        }
      }
      // console.log('getter key = ', key)
      return val
    },
    set(newV) {
      // console.log('setter key = ', key)
      if (val === newV) return
      val = newV
      observe(val)
      dep.notify()
    }
  })
}
