const callbacks = []
let pending = false
export default function nextTick(cb) {
  callbacks.push(cb)
  if (!pending) {
    // 表示异步任务队列中已经有 flushCallbacks 了
    pending = true
    timerFunc()
  }
}

/**
 * 刷新 callbacks 数组
 */
function flushCallbacks() {
  // 表示当前异步任务队列中的 flushCallbacks 已经被执行，可以有新的 flushCallbacks 任务进来了
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0, len = copies.length; i < len; i++) {
    copies[i]()
  }
}

// timerFunc
const timerFunc = () => Promise.resolve().then(flushCallbacks)

const queue = []
let waiting = false, flushing = false
export function queueWatcher(watcher) {
  // 保证 watcher 不会重复入队
  if (!queue.includes(watcher)) {
    if (!flushing) {
      // 表示当前 watcher 队列没有在被刷新
      queue.push(watcher)
    } else {
      // watcher 队列已经在刷新了，则新进来的 watcher 需要放在合适的位置，保证队列仍是有序的
      let i = watcher.length - 1
      while (i >= 0) {
        if (watcher.id > queue[i].id) {
          // 说明找到了
          queue.splice(i + 1, 0, watcher)
          break;
        }
      }
    }
  }
  // 保证 callbacks 数组中只有一个刷新 watcher 队列的函数
  if (!waiting) {
    waiting = true
    nextTick(flushSchedulerQueue)
  }
}

function flushSchedulerQueue() {
  // 表示 callbacks 数组中负责刷新 watcher 队列的函数已经被执行，新的函数可以进来了
  waiting = false
  // watcher 队列排序，保证 组件 更新时的效率
  queue.sort((a, b) => a.id - b.id)

  while (queue.length) {
    const watcher = queue.shift()
    watcher.run()
  }
}