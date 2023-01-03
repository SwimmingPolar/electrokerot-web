import { useEffect, useState } from 'react'
import { SelectedFiltersElementType } from 'features'

export const useAreFiltersOverflow = (
  selectedFilters: SelectedFiltersElementType[]
) => {
  const [overflow, setOverflow] = useState(false)

  useEffect(() => {
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
  }, [selectedFilters])

  return overflow
}
