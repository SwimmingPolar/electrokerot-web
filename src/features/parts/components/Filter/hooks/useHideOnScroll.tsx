import React, { useEffect } from 'react'

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
  let lastScroll = document.documentElement.scrollTop
  let height = 0

  useEffect(() => {
    const scrollHandler = () => {
      // If the target element is not mounted, return
      if (!target.current) {
        return
      }

      // Get the direction of the scroll
      const offset = document.documentElement.scrollTop - lastScroll

      // Calculate the current matrix value for the y axis
      const currentMatrix = getComputedStyle(target.current).getPropertyValue(
        'transform'
      )

      // 'm41' and 'm42' are the x and y values of the matrix
      const oldTranslateY = new DOMMatrixReadOnly(currentMatrix).m42
      let newTranslateY = oldTranslateY - offset

      // Lowest possible value for the translateY
      const lowestTranslateY =
        0 - height - precedingHeaderHeight - trailingHeaderHeight

      // Handle out of range values
      if (newTranslateY < lowestTranslateY) {
        newTranslateY = lowestTranslateY
      } else if (newTranslateY > 0) {
        newTranslateY = 0
      }

      // Save the current scroll position
      lastScroll = document.documentElement.scrollTop

      // @Todo: Find a way to preserve the other values of the matrix
      target.current.style.transform = `translateY(${newTranslateY}px)`
    }

    // Save the height of the target element on mount
    height = target.current?.offsetHeight || 0

    window.addEventListener('scroll', scrollHandler)
    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [])
}
