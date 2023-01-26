import { useIsPresent } from 'framer-motion'
import { useDetectMobile, useDeviceDetect } from 'hooks'
import { useEffect, useLayoutEffect, useState } from 'react'
/**
 *
 *  1. Try to get the scrollbar width from the browser.
 *     By calculating the difference between the window width and the document width.
 *     If the scrollbar exists, the width will be greater than 0
 *
 *  2. On mobile devices or simulators like Chrome DevTools, the scrollbar width calculated might not be accurate.
 *     This happens because of meta viewport tag. To get the scrollbarWidth a little bit more accurate, we need to
 *     check if the device is mobile or not. If it is, we return 0. This is by far the best solution I could find.
 *
 *  3. On desktop, to get the scrollbarWidth, we create a hidden element and append it to the body.
 *     Then, set the height of the hidden element to 100vh + 1px.
 *     This will force the scrollbar to appear but not visible to the user.
 *     Then, subtract the width of the hidden element from the window width.
 *     This will give us the width of the scrollbar.
 *
 */

let isScrollbarHiding: boolean

const { getBackupScrollbarWidth, cacheBackupScrollbarWidth } = (() => {
  let backupScrollbarWidth: number
  return {
    getBackupScrollbarWidth: () => backupScrollbarWidth,
    cacheBackupScrollbarWidth: (scrollbarWidth: number) => {
      backupScrollbarWidth = scrollbarWidth
    }
  }
})()

export const getScrollbarWidth = () => {
  // First calculate the width of the scrollbar from the browser
  // If the scrollbar exists, the width will be greater than 0
  let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  if (scrollbarWidth > 0) {
    return scrollbarWidth
  }

  const hiddenElement = document.createElement('div')
  hiddenElement.style.height = 'calc(100vh + 1px)'
  hiddenElement.style.visibility = 'hidden'

  const overflowStyle = document.documentElement.style.overflowY
  document.documentElement.style.overflowY = 'scroll'

  document.body.appendChild(hiddenElement)

  scrollbarWidth = window.innerWidth - hiddenElement.clientWidth

  document.body.removeChild(hiddenElement)

  document.documentElement.style.overflowY = overflowStyle

  return scrollbarWidth
}

export const useScrollbarWidth = () => {
  const isMobile = useDetectMobile()
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  // Initial scrollbar width
  useLayoutEffect(() => {
    // On mobile devices, the scrollbar width is 0
    // we do not need to calculate the scrollbar width
    if (isMobile) {
      return
    }

    // Get the initial scrollbar width
    const scrollbarWidth = getScrollbarWidth()

    // Save it as a backup
    // scrollbarWidthBackup = scrollbarWidth
    cacheBackupScrollbarWidth(scrollbarWidth)

    // Update the scrollbarWidth state
    setScrollbarWidth(scrollbarWidth)
  }, [isMobile])

  // Get scrollbar width on window resize
  useEffect(() => {
    // On mobile devices, the scrollbar width is 0
    // we do not need to listen to the resize event
    if (isMobile) {
      return
    }

    const handleResize = () => {
      const scrollbarWidth = getScrollbarWidth()

      // Will only update the scrollbar width if it's different from the backup
      if (scrollbarWidth !== getBackupScrollbarWidth()) {
        setScrollbarWidth(scrollbarWidth)
        cacheBackupScrollbarWidth(scrollbarWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobile])

  if (isMobile) {
    return 0
  }

  // If the scrollbar is hidden because some components called 'useScrollbarPadding' to hide the scrollbar,
  // then return the backup scrollbar width. When the scrollbar is hidden, when the scrollbarWidth is requested
  // This probably means that some components are trying to calculate the width of the scrollbar to add padding.
  // But newly calculated scrollbar width will be 0, so we need to return the backup scrollbar width.
  return isScrollbarHiding ? getBackupScrollbarWidth() : scrollbarWidth
}

// If ignoreInitialPadding is true, it won't add padding on mount
export const useScrollbarPadding = () => {
  const { isMobileFriendly } = useDeviceDetect()
  const isPresent = useIsPresent()

  const addPaddingForScrollbar = () => {
    // Indicate that the scrollbar is hidden
    isScrollbarHiding = true

    const hasScrollbar =
      document.documentElement.scrollHeight > window.innerHeight

    // enable padding when there's a scrollbar
    if (!hasScrollbar) {
      return
    }

    const scrollbarWidth = getScrollbarWidth()

    // disable scrollbar
    document.documentElement.style.overflowY = 'hidden'

    // get all elements that should have be padded
    const elements =
      Array.from(
        document.querySelectorAll<HTMLDivElement>('.scrollbar-padding')
      ) || []

    // add padding
    elements.forEach(element => {
      element.style.paddingRight = `${scrollbarWidth}px`
      element.classList.add('scrollbar-padding--enabled')
    })
  }

  const removePaddingForScrollbar = () => {
    // Indicate that the scrollbar will now be shown
    isScrollbarHiding = false

    // get all elements that should have be padded
    const elements =
      Array.from(
        document.querySelectorAll<HTMLDivElement>('.scrollbar-padding')
      ) || []

    // enable scrollbar
    document.documentElement.style.overflowY = 'auto'
    // @Issue: 패딩 없앨 때, 없애는 것이 아니라 복원해야하는 것이 아닌가?
    //         그러면 원래 값도 저장해야 하나?
    // remove padding enabled by this hook
    elements.forEach(element => {
      element.style.paddingRight = ''
      element.classList.remove('scrollbar-padding--enabled')
    })
  }

  useLayoutEffect(() => {
    if (!isPresent) {
      return
    }

    addPaddingForScrollbar()
    window.addEventListener('resize', addPaddingForScrollbar)

    return () => {
      // when unmounting, remove paddings
      removePaddingForScrollbar()
      window.addEventListener('resize', removePaddingForScrollbar)
    }
  }, [isPresent, isMobileFriendly])

  return {
    addPaddingForScrollbar,
    removePaddingForScrollbar
  }
}
