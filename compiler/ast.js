export default function createAstElement(node) {
  const { tagName, nodeType, textContent, attributes } = node
  const ast = {
    tag: tagName ? tagName.toLowerCase() : '',
    type: nodeType,
    text: nodeType === 1 ? '' : textContent,
    attr: {},
    children: [],
    parent: null
  }
  if (nodeType === 1) {
    // 元素节点
    const attr = Array.from(attributes)
    const attrMap = {}
    for (let i = 0, len = attr.length; i < len; i++) {
      const { name, value } = attr[i]
      attrMap[name] = value
    }
    ast.attr = attrMap
  }
  return ast
}