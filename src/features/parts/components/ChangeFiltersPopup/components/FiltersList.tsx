import { FilterDataType, SelectedFiltersType } from 'features'
import { useMemo } from 'react'
import styled from 'styled-components'
import { SelectedFilter } from './SelectedFilter'

const Box = styled.div`
  padding: 0 20px 20px 20px;
`

type FiltersListType = {
  targetFilter: string | undefined
  filterData: FilterDataType[]
  selectedFilters: SelectedFiltersType[]
  handleFilterOptionClick: (
    filterName: string,
    filterOption: string
  ) => () => void
  handleFilterNameClick: (filterName: string) => void
}

export const FiltersList = ({
  targetFilter,
  filterData,
  selectedFilters,
  handleFilterOptionClick,
  handleFilterNameClick
}: FiltersListType) => {
  // If targetFilter is provided, show only the related filter
  // Otherwise, show all the filters
  const filtersToShow = useMemo(
    () =>
      [...filterData].filter(({ category, subCategory }) => {
        const filterName = category || subCategory
        return targetFilter ? filterName === targetFilter : true
      }),
    [filterData]
  )

  return (
    <Box>
      {filtersToShow.map(({ category, subCategory, values }, index) => (
        <SelectedFilter
          key={index}
          targetFilter={targetFilter}
          filterData={filterData}
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
