import { SelectedFiltersElementType } from 'features'
import { useCallback, useEffect, useState } from 'react'

type UseIsScrollAtEndType = {
  selectedFilters: SelectedFiltersElementType[]
  containerSelector: string
}

export const useIsScrollAtEnd = ({
  selectedFilters,
  containerSelector
}: UseIsScrollAtEndType) => {
  const [isScrollAtEnd, setIsScrollAtEnd] = useState(false)
  const [isScrollAtStart, setIsScrollAtStart] = useState(true)

  const handleScroll = useCallback(() => {
    const container = document.querySelector(
      `.${containerSelector}`
    ) as HTMLElement
    const {
      // Width of the entire element
      scrollWidth,
      // Offset from the left edge (how much scrolled)
      scrollLeft,
      // Width of the visible part of the element
      offsetWidth
    } = container || {}

    // Decide if the scroll is at the start
    if (scrollLeft === 0) {
      setIsScrollAtStart(true)
    } else {
      setIsScrollAtStart(false)
    }

    // Decide if the scroll is at the end
    const isScrollAtEnd = scrollLeft + offsetWidth === scrollWidth
    setIsScrollAtEnd(isScrollAtEnd)
  }, [])

  // Whenever the selected filters change, check the scroll state
  useEffect(() => {
    handleScroll()

    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('resize', handleScroll)
    }
  }, [selectedFilters])

  return {
    isScrollAtEnd,
    isScrollAtStart,
    handleScroll
  }
}
