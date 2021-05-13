export default function parseRawAttr(vnode) {
  vnode.attr = {}
  const rawAttr = Array.from(vnode.rawAttr)
  for (let i = 0, len = rawAttr.length; i < len; i++) {
    const { name, value } = rawAttr[i]
    vnode.attr[name] = value
  }
}