// _c(tag, attr, children)
export default function genElement(ast) {
  const { tag, attr } = ast
  const children = ast.children ? genChildren(ast.children) : []
  return `_c("${tag}", ${JSON.stringify(attr)}, ${children})`
}

function genChildren(children) {
  const ret = []
  for (let i = 0, len = children.length; i < len; i++) {
    const { type, text } = children[i]
    if (type === 3) {
      if (text.match(/{{(.*)}}/)) {
        // 动态文本
        ret.push(`_v(_s(${RegExp.$1.trim()}))`)
      } else {
        // 静态文本
        ret.push(`_v("${text.trim()}")`)
      }
    } else {
      ret.push(genElement(children[i]))
    }
  }
  return `[${ret.join(',')}]`
}