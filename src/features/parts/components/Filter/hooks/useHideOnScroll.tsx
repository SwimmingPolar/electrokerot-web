import { PartsCategoriesType } from 'constant'
import { useDeviceDetect } from 'hooks'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

type UseHideOnScrollProps = {
  target: React.RefObject<HTMLDivElement>
  precedingHeaderHeight: number
  trailingHeaderHeight: number
}

/**
 *
 * @Param target The target element to be hidden/revealed
 * @param precedingHeaderHeight The total sum of the heights of the headers above the target element
 * @param trailingHeaderHeight The total sum of the heights of the headers below the target element
 */
export const useHideOnScroll = ({
  target,
  precedingHeaderHeight,
  trailingHeaderHeight
}: UseHideOnScrollProps) => {
  const { category } = useParams() as { category: PartsCategoriesType }
  const { isMobileFriendly } = useDeviceDetect()

  useEffect(() => {
    let originalTop = 0
    let height = 0
    let lastScroll = document.documentElement.scrollTop

    const scrollHandler = () => {
      // If the target element is not mounted, return
      if (!target.current) {
        return
      }

      // Get the direction of the scroll
      const offset = document.documentElement.scrollTop - lastScroll

      // Calculate the current matrix value for the y axis
      const oldTop =
        parseInt(getComputedStyle(target.current).top.replace('px', '')) || 0

      let newTop = oldTop - offset

      // Lowest possible value for the top position
      const lowestTop =
        originalTop - height - precedingHeaderHeight - trailingHeaderHeight

      // Handle out of range values
      if (newTop < lowestTop) {
        newTop = lowestTop
      } else if (newTop > originalTop) {
        newTop = originalTop
      }

      // Save the current scroll position
      lastScroll = document.documentElement.scrollTop

      // @Todo: Find a way to preserve the other values of the matrix
      target.current.style.top = newTop + 'px'
    }

    // Save the height and the original top of the target element on mount
    height = target.current?.offsetHeight || 0
    originalTop = target.current?.offsetTop || 0

    // Enable the hook on mobile friendly devices only
    if (isMobileFriendly) {
      target.current && (target.current.style.top = originalTop + 'px')
      window.addEventListener('scroll', scrollHandler)
    }
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [category, isMobileFriendly])
}
