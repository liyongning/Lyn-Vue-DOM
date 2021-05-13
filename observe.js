import Observer from "./observer.js"

export default function observe(value) {
  if (typeof value !== 'object') return

  let ob = null

  if (value.__ob__) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }

  return ob
}