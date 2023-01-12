import { FilterValuesType, SelectedFiltersElementType } from 'features'
import { useMemo } from 'react'
import styled from 'styled-components'
import { SelectedFilter } from './SelectedFilter'

const Box = styled.div`
  padding: 20px 20px;
`

type FiltersListType = {
  targetFilter: string | undefined
  filters: FilterValuesType[]
  selectedFilters: SelectedFiltersElementType[]
  handleFilterOptionClick: (
    filterName: string,
    filterOption: string
  ) => () => void
  handleFilterNameClick: (filterName: string) => void
}

export const FiltersList = ({
  targetFilter,
  filters,
  selectedFilters,
  handleFilterOptionClick,
  handleFilterNameClick
}: FiltersListType) => {
  // If targetFilter is provided, show only the related filter
  // Otherwise, show all the filters
  const filtersToShow = useMemo(
    () =>
      [...filters].filter(({ category, subCategory }) => {
        const filterName = category || subCategory
        return targetFilter ? filterName === targetFilter : true
      }),
    [filters]
  )

  return (
    <Box>
      {filtersToShow.map(({ category, subCategory, values }, index) => (
        <SelectedFilter
          key={index}
          targetFilter={targetFilter}
          filters={filters}
          filterName={(category || subCategory) as string}
          filterOptions={values}
          selectedFilters={selectedFilters}
          handleFilterOptionClick={handleFilterOptionClick}
          handleFilterNameClick={handleFilterNameClick}
        />
      ))}
    </Box>
  )
}
