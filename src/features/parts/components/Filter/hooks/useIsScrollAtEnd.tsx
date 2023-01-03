import { SelectedFiltersElementType } from 'features'
import { useCallback, useEffect, useState } from 'react'

export const useIsScrollAtEnd = (
  selectedFilters: SelectedFiltersElementType[]
) => {
  const [isScrollAtEnd, setIsScrollAtEnd] = useState(false)
  const [isScrollAtStart, setIsScrollAtStart] = useState(true)

  const handleScroll = useCallback(() => {
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
  }, [selectedFilters])

  return {
    isScrollAtEnd,
    isScrollAtStart,
    handleScroll
  }
}
