import { useIsPresent } from 'framer-motion'
import { useDeviceDetect } from 'hooks'
import { useLayoutEffect } from 'react'

export const getScrollbarWidth = () => {
  const hiddenElement = document.createElement('div')
  hiddenElement.style.height = 'calc(100vh + 1px)'
  hiddenElement.style.visibility = 'hidden'

  const overflowStyle = document.documentElement.style.overflowY
  document.documentElement.style.overflowY = 'scroll'

  document.body.appendChild(hiddenElement)

  const scrollbarWidth = window.innerWidth - hiddenElement.clientWidth

  document.body.removeChild(hiddenElement)

  document.documentElement.style.overflowY = overflowStyle

  return scrollbarWidth
}

export const useScrollbarWidth = () => {
  return getScrollbarWidth()
  // @Todo: remove below code later
  // const [scrollbarWidth, setScrollbarWidth] = useState(0)

  // // Initial scrollbar width
  // useLayoutEffect(() => {
  //   const scrollbarWidth = getScrollbarWidth()
  //   setScrollbarWidth(scrollbarWidth)
  // }, [])

  // // Get scrollbar width on window resize
  // useEffect(() => {
  //   const handleResize = () => {
  //     const scrollbarWidth = getScrollbarWidth()
  //     setScrollbarWidth(scrollbarWidth)
  //   }
  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  // return scrollbarWidth
}

export const addPaddingForScrollbar = () => {
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

export const removePaddingForScrollbar = () => {
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

type UseScrollbarPaddingProps = {
  ignoreInitialPadding?: boolean
}

// If ignoreInitialPadding is true, it won't add padding on mount
export const useScrollbarPadding = (props?: UseScrollbarPaddingProps) => {
  const { isMobileFriendly } = useDeviceDetect()
  const isPresent = useIsPresent()

  const { ignoreInitialPadding } = props || {}

  useLayoutEffect(() => {
    if (ignoreInitialPadding) {
      return
    }
    if (!isPresent) {
      return
    }

    // Mobile devices don't have scrollbar width thus,
    // no need to add padding if the device is on mobile
    if (isMobileFriendly) {
      return
    }

    addPaddingForScrollbar()

    return () => {
      // when unmounting, remove paddings
      removePaddingForScrollbar()
    }
  }, [isPresent, isMobileFriendly])

  return {
    addPaddingForScrollbar,
    removePaddingForScrollbar
  }
}
