import { useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import {
  selectFilters,
  selectFiltersState,
  selectSelectedFilters,
  ToggleChangeFiltersPopupType
} from 'features'
import { useDeviceDetect } from 'hooks'
import React, { FC, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { MemoizedFilterRow as FilterRow } from './FilterRow'

const Box = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 9px;
`

export const LowerBox: FC = () => {
  const { isMobileFriendly } = useDeviceDetect()
  const { category } = useParams() as { category: PartsCategoriesType }

  // Get filters list for the category
  const filters = useSelector(selectFilters)?.[category] || []

  // Get selected filters options for the category
  const selectedFilters = useSelector(selectSelectedFilters)?.[category] || []

  // Get backup for the selected filters options
  const backupSelectedFilters =
    useSelector(selectSelectedFilters).backup?.[category] || []

  // Decides whether the filter is open or not
  const isFilterOpen = useSelector(selectFiltersState)[category]?.open

  // Default filters count to show: 5
  const filtersList = useMemo(
    () => (!isFilterOpen ? filters?.slice(0, 5) : filters),
    [filters, isFilterOpen]
  )

  // Render filter row for each filter
  const FiltersList = useMemo(
    () =>
      filtersList?.map((filter, index) => {
        const filterName = (filter?.category || filter?.subCategory) as string
        const selectedFiltersForThisFilterName = selectedFilters.find(
          selectedFilter => selectedFilter.filterName === filterName
        )
        const backup = backupSelectedFilters.find(
          backupSelectedFilter => backupSelectedFilter.filterName === filterName
        )

        return (
          <FilterRow
            key={index}
            filter={filter}
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
