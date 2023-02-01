import { useCallback, useEffect } from 'react'

let isMouseDown = false

const registerEvents = (events: any[]) =>
  events.forEach(event => {
    window.addEventListener(event.type, event.handler)
  })

const unregisterEvents = (events: any[]) =>
  events.forEach(event => {
    window.removeEventListener(event.type, event.handler)
  })

export const useMoveScroll = (containerSelector: string) => {
  let oldMouseX: number

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const container = document.querySelector(
        `.${containerSelector}`
      ) as HTMLElement
      // If the mouse is down and moving at the same time
      // add 'scrolling' class to the container element.
      // This is to prevent button from being clicked when scrolling.
      if (isMouseDown) {
        container.classList.add('scrolling')
      }

      const deltaX = oldMouseX - event.clientX

      container.scrollLeft += deltaX

      oldMouseX = event.clientX
    },
    [containerSelector]
  )

  const handleMousePress = useCallback(
    (event: MouseEvent) => {
      const container = document.querySelector(
        `.${containerSelector}`
      ) as HTMLElement

      // If the click was not occurred within the container, don't bother
      if (!container.contains(event.target as HTMLElement)) {
        return
      }

      // Enable scrolling
      window.addEventListener('mousemove', handleMouseMove)
      // Mark mouse as pressed
      isMouseDown = true
      oldMouseX = event.clientX
    },
    [handleMouseMove, containerSelector]
  )

  const handleMouseRelease = useCallback(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    // Postpone removing 'scrolling' class to prevent
    // button from being clicked when scrolling.
    // Event order: mouseDown -> mouseUp -> click
    // By doing this, we are moving mouseUp event to the end of the queue
    // So, inside 'click' handler, we can check if the 'scrolling' class is present
    setTimeout(() => {
      // Remove 'scrolling' class when mouse is released
      if (isMouseDown) {
        const container = document.querySelector(
          `.${containerSelector}`
        ) as HTMLElement
        container.classList.remove('scrolling')
      }
      // Mark mouse as released
      isMouseDown = false
    }, 0)
  }, [handleMouseMove, containerSelector])

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const container = document.querySelector(
        `.${containerSelector}`
      ) as HTMLElement
      // If the click was not occurred within the container, don't bother
      if (!container.contains(event.target as HTMLElement)) {
        return
      }

      // If the mouse is down, don't scroll
      if (isMouseDown) {
        return
      }

      container.scrollLeft += event.deltaY
    },
    [containerSelector]
  )

  useEffect(() => {
    const events = [
      {
        type: 'mousedown',
        handler: handleMousePress
      },
      {
        type: 'mouseup',
        handler: handleMouseRelease
      },
      {
        type: 'wheel',
        handler: handleWheel
      }
    ]

    registerEvents(events)
    return () => {
      unregisterEvents(events)
    }
  }, [])
}
