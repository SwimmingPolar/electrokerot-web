import { useEffect } from 'react'

const findNextFocusableElement = (direction: 'next' | 'previous') => {
  const currentlyFocusedElement = document.querySelector(
    '*:focus-visible'
  ) as HTMLElement

  // this is needed if MUI modal is opened
  const nearestRoot =
    currentlyFocusedElement?.closest('[tabindex="-1"]') || document
  const focusableElements =
    // get all focusable elements
    Array.from(nearestRoot.querySelectorAll('[tabindex="0"]'))
      // filter not visible elements
      .filter(element => getComputedStyle(element).display !== 'none')

  const indexOfCurrentlyFocusedElement = focusableElements.indexOf(
    currentlyFocusedElement
  )

  let indexOfNextElement: number
  if (direction === 'next') {
    indexOfNextElement =
      indexOfCurrentlyFocusedElement + 1 >= focusableElements.length
        ? 0
        : indexOfCurrentlyFocusedElement + 1
  } else {
    indexOfNextElement =
      indexOfCurrentlyFocusedElement - 1 < 0
        ? focusableElements.length - 1
        : indexOfCurrentlyFocusedElement - 1
  }

  return focusableElements[indexOfNextElement]
}

export const useArrowMoveFocus = () => {
  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      // move focus by arrow key only when focus ring is visible
      const isFocusVisible = document.querySelector('*:focus-visible')
      if (!isFocusVisible) {
        return
      }

      // on ArrowLeft/ArrowUp, move focus to previous focusable element
      // on ArrowRight/ArrowDown, move focus to next focusable element
      const keyList = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      if (keyList.includes(event.key)) {
        // If the focus ring is visible, that means the user is using keyboard
        // to navigate the page. In this case, we don't want to scroll the page.
        // So we prevent the default behavior of the arrow keys.
        event.preventDefault()

        const direction =
          event.key === 'ArrowLeft' || event.key === 'ArrowUp'
            ? 'previous'
            : 'next'
        const target = findNextFocusableElement(direction) as HTMLElement
        target?.focus()
        return
      }
    }
    window.addEventListener('keydown', eventHandler)
    return () => {
      window.removeEventListener('keydown', eventHandler)
    }
  }, [])
}
