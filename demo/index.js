workLoop()

function workLoop () {
  let workId = 0
  requestIdleCallback(
    function work (IdleDeadline) {
      workId++

      let shouldYield = IdleDeadline.timeRemaining() < 1

      while (!shouldYield) {
        // run
        console.log('workId', workId)

        shouldYield = IdleDeadline.timeRemaining() < 1
      }

      requestIdleCallback(work)
    }
  )
}
