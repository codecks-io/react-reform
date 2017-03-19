function getScrollParent(node) {
  let offsetParent = node
  while ((offsetParent = offsetParent.offsetParent)) {
    const overflowYVal = window.getComputedStyle(offsetParent, null).getPropertyValue('overflow-y')
    if (overflowYVal === 'auto' || overflowYVal === 'scroll') return offsetParent
  }
  return window
}

let lastScrollTime = null
let currentSpeed = null
let currentScrollRafID = null
let currentScrollY = null

const smoothScroll = (node, scrollParent, targetY) => {
  if (currentScrollRafID) window.cancelAnimationFrame(currentScrollRafID)
  lastScrollTime = new Date().getTime()
  currentSpeed = currentSpeed || 0

  currentScrollY = scrollParent === window ? window.scrollY : scrollParent.scrollTop
  const fn = () => {
    const currTime = new Date().getTime()
    const dt = (currTime - lastScrollTime) / 1000
    const dir = currentScrollY > targetY ? -1 : 1
    currentSpeed = Math.max(-200, Math.min(200, currentSpeed + (dir * 200 * dt)))
    currentScrollY += currentSpeed * dt
    if (dir > 0) {
      if (currentScrollY >= targetY) currentScrollY = targetY
    } else {
      // eslint-disable-next-line no-lonely-if
      if (currentScrollY <= targetY) currentScrollY = targetY
    }
    if (scrollParent === window) {
      window.scrollTo(0, currentScrollY)
    } else {
      scrollParent.scrollTop = currentScrollY
    }
    if (currentScrollY !== targetY) {
      currentScrollRafID = window.requestAnimationFrame(fn)
    } else {
      currentSpeed = null
      currentScrollRafID = null
      currentScrollY = null
    }
  }
  currentScrollRafID = window.requestAnimationFrame(fn)
}

export function scrollToNode(node) {
  debugger
  const sp = getScrollParent(node)
  const targetY = ((sp === window ? 0 : sp.scrollTop) + node.getBoundingClientRect().top) - 50
  smoothScroll(node, sp, targetY)
}
