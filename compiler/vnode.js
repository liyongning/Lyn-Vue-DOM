export default function vnode(node) {
  const { tagName, nodeType, attributes, textContent } = node
  let elm = {
    tag: '',
    type: 1,
    rawAttr: [],
    text: '',
    parent: null,
    children: [],
    isComponent: false
  }
  if (nodeType === 3) {
    // 文本节点
    elm.type = 3
    elm.text = textContent
  } else {
    // 保留标签
    // @todu 组件
    elm = { ...elm, ...{ tag: tagName.toLowerCase(), type: 1, rawAttr: attributes } }
  }
  return elm
}