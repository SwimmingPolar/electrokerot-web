import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
  ChangeFilterPopupDimension,
  PartsCategories,
  PartsCategoriesKr,
  PartsCategoriesType
} from 'constant'
import { SelectedFiltersElementType } from 'features'
import { useMemo } from 'react'
import styled from 'styled-components'

const Box = styled.div``

const SelectBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  height: 58px;
  width: ${ChangeFilterPopupDimension.withoutTargetFilter.default.width}px;
  padding: 1px 0 0 25px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary200};
  border-top-left-radius: 7px;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 3;
`

type PopupHeaderType = {
  targetFilter: string | undefined
  category: PartsCategoriesType
  handleChangeCategory: (event: SelectChangeEvent) => void
  selectedFilters: SelectedFiltersElementType[]
}

export const PopupHeader = ({
  targetFilter,
  category,
  handleChangeCategory,
  selectedFilters
}: PopupHeaderType) => {
  if (targetFilter) {
    return null
  }

  // // Show the shadow if the filters overflow
  // const hasOverflow = useAreFiltersOverflow(selectedFilters)
  // // Show the shadow if the scroll is not at the end
  // const { isScrollAtStart, isScrollAtEnd, handleScroll } = useIsScrollAtEnd({
  //   selectedFilters,
  //   containerSelector: SelectedFilterItemsBoxClassName
  // })
  // // Enable scrolling on the list
  // useMoveScroll(SelectedFilterItemsBoxClassName)

  // // Shadows for both edges of the list
  // const StyledGradientShadow = ({
  //   direction
  // }: {
  //   direction: 'left' | 'right'
  // }) => (
  //   <GradientShadow
  //     hasOverflow={hasOverflow}
  //     isScrollAtEnd={isScrollAtEnd}
  //     isScrollAtStart={isScrollAtStart}
  //     direction={direction}
  //   />
  // )

  const selectedFiltersName = useMemo(
    () => selectedFilters.map(({ filterName }) => filterName),
    [selectedFilters]
  )

  return (
    <Box>
      <SelectBox>
        <FormControl sx={{ minWidth: '150px' }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={handleChangeCategory}
            label="category"
            sx={{ padding: '0 30px' }}
          >
            {PartsCategories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {PartsCategoriesKr[category]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SelectBox>
    </Box>
  )
}
