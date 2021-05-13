export default function patch(target) {
  target.__patch__ = function (prevVnode, vnode) {
    if (prevVnode.nodeType) {
      // 真实元素，首次渲染
    } else {
      // 后续更新
    }
  }
}