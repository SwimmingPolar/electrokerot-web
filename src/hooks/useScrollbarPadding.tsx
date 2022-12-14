import { useIsPresent } from 'framer-motion'
import { useDeviceDetect } from 'hooks'
import { useLayoutEffect } from 'react'

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

    const scrollbarWidth = window.innerWidth - document.body.offsetWidth

    // disable scrollbar
    document.documentElement.style.overflowY = 'hidden'

    // get all elements that should have padding
    const elements =
      Array.from(
        document.querySelectorAll<HTMLDivElement>('.scrollbar-padding')
      ) || []

    // add padding
    elements.forEach(
      element => (element.style.paddingRight = `${scrollbarWidth}px`)
    )

    return () => {
      // enable scrollbar
      document.documentElement.style.overflowY = 'auto'
      // remove padding enabled by this hook
      elements.forEach(element => (element.style.paddingRight = ''))
    }
  }, [isPresent, isMobileFriendly])
}
