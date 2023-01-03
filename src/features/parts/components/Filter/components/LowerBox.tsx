import { useSelector } from 'app'
import { selectFiltersState } from 'features'
import { useDeviceDetect } from 'hooks'
import styled from 'styled-components'
import { useLoadFilterJson } from '../hooks/useLoadFilterJson'
import { FilterRow } from './FilterRow'

const Box = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 11px;
`

export const LowerBox = () => {
  const { isMobileFriendly } = useDeviceDetect()

  // Dynamically load filter json file to reduce bundle size
  const { category, filters } = useLoadFilterJson()

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
