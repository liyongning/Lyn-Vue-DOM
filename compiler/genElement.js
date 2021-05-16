export default function genElement(ast) {
  const { tag, attr, children } = ast
  return `_c('${tag}', ${JSON.stringify(attr)}, ${genChildren(children)})`
}

function genChildren(children) {
  const ret = []
  for (let i = 0, len = children.length; i < len; i++) {
    const { type, text } = children[i]
    if (type === 3) {
      // 文本节点
      if (text.match(/{{(.*)}}/)) {
        // 动态文本节点
        ret.push(`_v(${RegExp.$1.trim()})`)
      } else {
        // 静态文本节点
        ret.push(`_v('${text}')`)
      }
      continue
    }
    ret.push(genElement(children[i]))
  }
  return `[${ret.join(',')}]`
}