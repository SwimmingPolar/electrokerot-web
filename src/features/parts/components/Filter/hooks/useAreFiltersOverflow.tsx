import { SelectedFiltersType } from 'features'
import { useCallback, useEffect, useState } from 'react'

export const useAreFiltersOverflow = (
  selectedFilters: SelectedFiltersType[]
) => {
  const [overflow, setOverflow] = useState(false)

  const hasOverflow = useCallback(() => {
    // Get outer box width
    const selectedFiltersListBoxWidth = document.querySelector(
      '.selected-filters-list-box'
    )?.scrollWidth

    // Get inner box width
    const selectedFilterItemsBoxWidth = document.querySelector(
      '.selected-filter-items-box'
    )?.scrollWidth

    const overflow =
      Number(selectedFilterItemsBoxWidth) - Number(selectedFiltersListBoxWidth)

    if (Number.isNaN(overflow)) {
      setOverflow(false)
    }

    // When inner box width is greater than outer box width, then there is overflow
    if (overflow > 0) {
      setOverflow(true)
    }
    // When inner box width is less than outer box width, then there is no overflow
    else if (overflow <= 0) {
      setOverflow(false)
    }
  }, [])

  // Whenever the selected filters change, check the overflow status
  useEffect(() => {
    hasOverflow()

    window.addEventListener('resize', hasOverflow)
    return () => {
      window.removeEventListener('resize', hasOverflow)
    }
  }, [selectedFilters])

  return overflow
}
