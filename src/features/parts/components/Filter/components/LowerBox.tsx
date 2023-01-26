import { useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { selectFilters } from 'features'
import { useDeviceDetect } from 'hooks'
import React, { FC, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { media } from 'styles'
import { MemoizedFilterRow as FilterRow } from './FilterRow'

const Box = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;

  ${media.tablet`
    gap: 4px;
  `}
  ${media.desktopSmall`
    gap: 4px;
  `}
`

export const LowerBox: FC = () => {
  const { isMobileFriendly } = useDeviceDetect()
  const { category } = useParams() as {
    category: PartsCategoriesType
  }

  // Get filters list for the category
  const filters = useSelector(state => selectFilters(state)[category]) || []

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

  return (
    // Do not render on mobile and foldable devices
    !isMobileFriendly ? (
      <Box>
        {filtersList?.map((filterData, index) => {
          // Get the filter name for this row
          const filterName = (filterData?.category ||
            filterData?.subCategory) as string

          return (
            <FilterRow
              key={index}
              category={category}
              filterName={filterName}
            />
          )
        }) || null}
      </Box>
    ) : null
  )
}

export const MemoizedLowerBox = React.memo(LowerBox)
