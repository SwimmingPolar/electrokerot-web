import { useCallback, useEffect } from 'react'
import { SelectedFilterItemsBoxClassName } from '../components/SelectedFiltersList'

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
      `.${SelectedFilterItemsBoxClassName}`
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

    // If the mouse is down and moving at the same time
    // add 'scrolling' class to the container element.
    // This is to prevent button from being clicked when scrolling.
    if (isMouseDown) {
      container.classList.add('scrolling')
    }

    switch (event.movementX) {
      // When moving left, scrollLeft should be greater than 0
      case MoveLeft:
        if (!isScrollAtEnd) {
          container.scrollLeft += 1
        }
        break
      // When moving right, scrollLeft should be less than scrollWidth
      case MoveRight:
        if (container.scrollLeft > 0) {
          container.scrollLeft += -1
        }
        break
    }
  }, [])

  const handleMousePress = useCallback(
    (event: MouseEvent) => {
      const container = document.querySelector(
        `.${SelectedFilterItemsBoxClassName}`
      ) as HTMLElement
      // If the click was not occurred within the container, don't bother
      if (!container.contains(event.target as HTMLElement)) {
        return
      }

      // Enable scrolling
      window.addEventListener('mousemove', handleMouseMove)
      // Mark mouse as pressed
      isMouseDown = true
    },
    [handleMouseMove]
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
          `.${SelectedFilterItemsBoxClassName}`
        ) as HTMLElement
        container.classList.remove('scrolling')
      }
      // Mark mouse as released
      isMouseDown = false
    }, 0)
  }, [handleMouseMove])

  const handleWheel = useCallback((event: WheelEvent) => {
    const container = document.querySelector(
      `.${SelectedFilterItemsBoxClassName}`
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
