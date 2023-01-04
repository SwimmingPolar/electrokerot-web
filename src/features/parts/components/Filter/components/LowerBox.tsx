import { useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import {
  selectFilters,
  selectFiltersState,
  ToggleChangeFiltersPopupType
} from 'features'
import { useDeviceDetect } from 'hooks'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { FilterRow } from './FilterRow'

const Box = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 9px;
`

type UpperBoxType = {
  toggleChangeFiltersPopup: ToggleChangeFiltersPopupType
}

export const LowerBox = ({ toggleChangeFiltersPopup }: UpperBoxType) => {
  const { isMobileFriendly } = useDeviceDetect()
  const { category } = useParams() as { category: PartsCategoriesType }

  // Get filters list for the category
  const filters = useSelector(selectFilters)?.[category] || []

  // Decides whether the filter is open or not
  const isFilterOpen = useSelector(selectFiltersState)[category]?.open

  // Default filters count to show: 5
  const filtersList = !isFilterOpen ? filters?.slice(0, 5) : filters

  return (
    // Do not render on mobile and foldable devices
    !isMobileFriendly ? (
      <Box>
        {filtersList &&
          filtersList.map((filter, index) => (
            <FilterRow key={index} {...filter} />
          ))}
      </Box>
    ) : null
  )
}
