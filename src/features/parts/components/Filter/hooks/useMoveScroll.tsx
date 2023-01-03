import { useCallback, useEffect } from 'react'

let isMouseDown = false

const MoveLeft = -1
const MoveRight = 1

const registerEvents = (events: any[]) =>
  events.forEach(event => {
    window.addEventListener(event.type, event.handler)
  })

const unregisterEvents = (events: any[]) =>
  events.forEach(event => {
    window.removeEventListener(event.type, event.handler)
  })

export const useMoveScroll = () => {
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const container = document.querySelector(
      '.selected-filter-items-box'
    ) as HTMLElement
    const {
      // Width of the entire element
      scrollWidth,
      // Offset from the left edge (how much scrolled)
      scrollLeft,
      // Width of the visible part of the element
      offsetWidth
    } = container || {}

    const isScrollAtEnd = scrollLeft + offsetWidth === scrollWidth

    switch (event.movementX) {
      case MoveLeft:
        // When moving left, scrollLeft should be greater than 0
        if (!isScrollAtEnd) {
          container.scrollLeft += 1
        }
        break
      // Move right
      case MoveRight:
        if (container.scrollLeft > 0) {
          container.scrollLeft += -1
        }
        break
    }
  }, [])

  const handleMousePress = useCallback((event: MouseEvent) => {
    const container = document.querySelector(
      '.selected-filter-items-box'
    ) as HTMLElement
    // If the click was not occurred within the container, don't bother
    if (!container.contains(event.target as HTMLElement)) {
      return
    }

    // Enable scrolling
    window.addEventListener('mousemove', handleMouseMove)
    isMouseDown = true
  }, [])

  const handleMouseRelease = useCallback(() => {
    // isMouseDown = false
    window.removeEventListener('mousemove', handleMouseMove)
    isMouseDown = false
  }, [])

  const handleWheel = useCallback((event: WheelEvent) => {
    const container = document.querySelector(
      '.selected-filter-items-box'
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
  }, [])

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
