import { setAttribute, createComponent } from './vnode.js'
import { isPreserveTag } from '../utils.js'

export default function patch(target) {
  function sameVnode(a, b) {
    // key 相同 && 标签相同 && 属性相同
    return a.key === b.key && (
      a.tag === b.tag &&
      a.attr && b.attr
    )
  }
  // 将 VNode 变成真实节点
  function createElm(parentElm, vnode, refElm) {
    if (vnode.text) {
      return vnode.elm = vnode.createTextNode(vnode.text)
    }
    if (!isPreserveTag(vnode.tag)) {
      // 组件
      createComponent(parentElm, vnode, refElm)
      return
    }
    const { tag, attr, children } = vnode
    vnode.elm = vnode.createElement(tag, attr, children)
    createChildren(vnode.elm, children)
    setAttribute(vnode, vnode.elm, attr)
    insert(parentElm, vnode.elm, refElm)
  }

  function insert(parentElm, node, refElm) {
    if (parentElm) {
      if (refElm) {
        parentElm.insertBefore(node, refElm)
      } else {
        parentElm.appendChild(node)
      }
    }
  }

  function createChildren(parentElm, children) {
    for (let i = 0, len = children.length; i < len; i++) {
      createElm(parentElm, children[i], null)
      if (children[i].text) {
        parentElm.appendChild(children[i].elm)
      }
    }
  }

  function addVnodes(elm, children) {
    for (let i = 0, len = children.length; i < len; i++) {
      elm.appendChild(children[i].elm)
    }
  }

  function removeVnodes(elm, children) {
    for (let i = 0, len = children.length; i < len; i++) {
      elm.removeChild(children[i].elm)
    }
  }

  function insertBefore(parent, node, ref) {
    parent.insertBefore(node, ref)
  }

  function updateChildren(oldVnode, newVnode) {
    // 四个游标，老开始、老结束、新开始、新结束
    let startOldIdx = 0, endOldIdx = oldVnode.length - 1, startNewIdx = 0, endNewIdx = newVnode.length - 1

    while (startOldIdx <= endOldIdx || startNewIdx <= endNewIdx) {
      if (sameVnode(oldVnode[startOldIdx], newVnode[startNewIdx])) {
        // 老开始和新开始是同一个节点
        patchVnode(oldVnode[startOldIdx], newVnode[startNewIdx])
        startOldIdx++
        startNewIdx++
      } else if (sameVnode(oldVnode[startOldIdx, newVnode[endNewIdx]])) {
        // 老开始和新结束是同一个节点
        patchVnode(oldVnode[startOldIdx, newVnode[endNewIdx]])
        // 移动节点，将老开始节点移动到最后
        const parentElm = oldVnode[startOldIdx].elm
        insertBefore(parentElm, oldVnode[startOldIdx].elm, parentElm.childNodes[parentElm.childNodes.length - 1].nextSibling)
        startOldIdx++
        endNewIdx--
      } else if (sameVnode(oldVnode[endOldIdx], newVnode[startNewIdx])) {
        // 老结束和新开始是同一个节点
        patchVnode(oldVnode[endOldIdx], newVnode[startNewIdx])
        // 将老结束节点移动到开始位置
        const parentElm = oldVnode[startOldIdx].elm
        insertBefore(parentElm, oldVnode[endOldIdx].elm, parentElm.childNodes[0])
        endOldIdx--
        startNewIdx++
      } else if (sameVnode(oldVnode[endOldIdx], newVnode[endNewIdx])) {
        // 老结束和新结束是同一个节点
        patchVnode(oldVnode[endOldIdx], newVnode[endNewIdx])
        endOldIdx--
        endNewIdx--
      } else {
        // 前面的假设都没命中，则遍历查找
        // 从老节点中找到新开始节点
      }
    }
  }

  function patchVnode(prevVnode, vnode) {
    if (prevVnode === vnode) return

    const ch = vnode.children, oldCh = prevVnode.children
    // 把每个节点的真实元素赋值给 vnode，避免下一次 patch 进来时 prevVnode.elm 为 null
    vnode.elm = prevVnode.elm

    if (vnode.text) {
      // 新节点存在文本节点
      if (prevVnode.text !== vnode.text) {
        // 更新文本节点
        prevVnode.elm.textContent = vnode.text
      }
    } else if (ch && oldCh && ch !== oldCh) {
      // 新老 vnode 都有孩子节点，并且不相同
      updateChildren(oldCh, ch)
    } else if (ch) {
      // 新 vnode 有孩子节点，老 vnode 没有，则新增这些孩子节点
      addVnodes(prevVnode.elm, ch)
    } else if (oldCh) {
      // 新 vnode 的孩子不存在，老的 vnode 孩子存在，则移除这些节点
      removeVnodes(prevVnode.elm, oldCh)
    } else if (prevVnode.text) {
      // 清空老节点的文本
      prevVnode.elm.textContent = ''
    }
  }

  return target.__patch__ = function (prevVnode, vnode) {
    if (!prevVnode) {
      // 渲染子组件
      createElm(null, vnode, null)
    } else if (prevVnode.nodeType) {
      // 真实节点，首次渲染
      createElm(document.body, vnode, prevVnode.nextSibling)
      document.body.removeChild(prevVnode)
    } else {
      // 后续更新
      patchVnode(prevVnode, vnode)
    }
  }
}