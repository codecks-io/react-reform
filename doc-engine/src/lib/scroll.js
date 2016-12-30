export function scrollTo(targetY, cb) {
  let lastTime = performance.now()
  let currentY = window.scrollY
  let acc = 0.01

  const performScroll = (time) => {
    const dtInS = (time - lastTime) / 1000
    lastTime = time
    if (dtInS > 0) {
      const maxVel = 10000 * dtInS * acc
      const diff = Math.max(-maxVel, Math.min(targetY - currentY, maxVel))
      acc += dtInS * 2
      currentY += diff
      window.scrollBy(0, diff)
    }
    if (currentY !== targetY) {
      requestAnimationFrame(performScroll)
    } else if (cb) {
      cb()
    }
  }

  requestAnimationFrame(performScroll)
}
