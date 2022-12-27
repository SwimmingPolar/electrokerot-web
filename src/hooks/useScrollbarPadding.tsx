import { useIsPresent } from 'framer-motion'
import { useDeviceDetect } from 'hooks'
import { useLayoutEffect, useState } from 'react'

export const useScrollbarWidth = () => {
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useLayoutEffect(() => {
    const hiddenElement = document.createElement('div')
    hiddenElement.style.height = 'calc(100vh + 1px)'
    hiddenElement.style.visibility = 'hidden'

    const overflowStyle = document.documentElement.style.overflowY
    document.documentElement.style.overflowY = 'scroll'

    document.body.appendChild(hiddenElement)

    const scrollbarWidth = window.innerWidth - hiddenElement.clientWidth

    document.body.removeChild(hiddenElement)

    document.documentElement.style.overflowY = overflowStyle

    setScrollbarWidth(scrollbarWidth)
  })

  return scrollbarWidth
}

export const getScrollbarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth

export const useScrollbarPadding = () => {
  const { isMobileFriendly } = useDeviceDetect()
  const isPresent = useIsPresent()

  useLayoutEffect(() => {
    if (!isPresent) {
      return
    }

    // Mobile devices don't have scrollbar width thus,
    // no need to add padding if the device is on mobile
    if (isMobileFriendly) {
      return
    }

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
    elements.forEach(
      element => (element.style.paddingRight = `${scrollbarWidth}px`)
    )

    // when unmounting
    return () => {
      // enable scrollbar
      document.documentElement.style.overflowY = 'auto'
      // remove padding enabled by this hook
      elements.forEach(element => (element.style.paddingRight = ''))
    }
  }, [isPresent, isMobileFriendly])
}
