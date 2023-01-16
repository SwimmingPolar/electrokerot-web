import { useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { selectFilters } from 'features'
import { useDeviceDetect } from 'hooks'
import React, { FC, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { MemoizedFilterRow as FilterRow } from './FilterRow'

const Box = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
`

export const LowerBox: FC = () => {
  const { isMobileFriendly } = useDeviceDetect()
  const { category } = useParams() as { category: PartsCategoriesType }

  // Get filters list for the category
  const filters = useSelector(selectFilters)?.[category] || []

  // Get selected filters options for the category
  const selectedFilters = filters?.selectedFilters || []

  // Get backup for the selected filters options
  const backupSelectedFilters = filters?.backupSelectedFilters || []

  // Decides whether the filter is open or not
  const isFilterOpen = filters?.filterState?.open

  // Default filters count to show: 5
  const filtersList = useMemo(
    () =>
      !isFilterOpen
        ? filters.filterData?.slice(0, 5) || []
        : filters.filterData,
    [filters, isFilterOpen]
  )

  // Render filter row for each filter
  const FiltersList = useMemo(
    () =>
      filtersList?.map((filterData, index) => {
        // Get the filter name for this row
        const filterName = (filterData?.category ||
          filterData?.subCategory) as string

        const selectedFiltersForThisFilterName = selectedFilters.find(
          selectedFilter => selectedFilter.filterName === filterName
        )
        const backup = backupSelectedFilters.find(
          backupSelectedFilter => backupSelectedFilter.filterName === filterName
        )
        const isSubFilterOpen = filters?.filterState?.subFilters?.[filterName]

        return (
          <FilterRow
            key={index}
            filterData={filterData}
            isSubFilterOpen={!!isSubFilterOpen}
            selectedFilters={selectedFiltersForThisFilterName}
            backupSelectedFilters={backup}
          />
        )
      }) || null,
    [filters, selectedFilters, filtersList]
  )

  return (
    // Do not render on mobile and foldable devices
    !isMobileFriendly ? <Box>{FiltersList}</Box> : null
  )
}

export const MemoizedLowerBox = React.memo(LowerBox)
