import { useDispatch, useSelector } from 'app'
import { PopupLayout } from 'components'
import { PartsCategoriesType } from 'constant'
import {
  SelectedFiltersElementType,
  selectFilters,
  selectSelectedFilters,
  setFilterOptions,
  ToggleChangeFiltersPopupType
} from 'features'
import { useScrollbarPadding, useScrollbarWidth } from 'hooks'
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { SideMenu } from './components/SideMenu'

const Box = styled.div<{ targetFilter?: string; scrollbarWidth: number }>`
  /* Without 'targetFilter', make the modal smaller */
  display: flex;
  width: ${({ targetFilter }) => (!targetFilter ? '540px' : '420px')};
  height: ${({ targetFilter }) => (!targetFilter ? '720px' : '580px')};
  background-color: ${({ theme }) => theme.colors.white};
  /* Popup layout has double negative margin-right to hide scrollbar for popup itself
     and the scrollbar for the side menu. On individual filter it does not
     have side menu hence, no scrollbar either.
     So we have to compensate for this double negative margin-right */
  padding-right: ${({ targetFilter, scrollbarWidth }) =>
    !targetFilter ? '0px' : scrollbarWidth + 'px'};
`

const SelectedFiltersSectionBox = styled.div`
  padding: 30px 20px;
`

const SelectedFilterBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
`

const SelectedFilterNameBox = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 800;
    font-family: ${({ theme }) => theme.fonts.secondary};
    color: ${({ theme }) => theme.colors.primary};
    padding: 16px 10px;
  }
`
const SelectedFilterOptionsBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 9px;
  button {
    display: flex;
    flex-shrink: 1;
    justify-content: center;
    align-items: center;
    padding: 10px 12px;
    background-color: ${({ theme }) => theme.colors.gray200};
    cursor: pointer;

    :hover {
      background-color: ${({ theme }) => theme.colors.blue100};
      text-decoration: underline;
    }
    :hover.selected {
      text-decoration: none;
    }

    span {
      font-size: 14px;
      font-family: ${({ theme }) => theme.fonts.primary};
    }
  }
  button.selected {
    background-color: ${({ theme }) => theme.colors.blue300};

    span {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`

const SideMenuScrollPadding = styled.div``

type SelectedFiltersSectionType = {
  filterName: string
  filterOptions: string[]
  selectedFilters: SelectedFiltersElementType[]
  handleClick: (filterName: string, filterOption: string) => () => void
}

const SelectedFilter = ({
  filterName,
  filterOptions,
  selectedFilters,
  handleClick
}: SelectedFiltersSectionType) => {
  // Extract the selected options for the filter
  const selectedFilter = selectedFilters.find(
    selectedFilter => selectedFilter.filterName === filterName
  )

  const isSelected = (option: string) =>
    selectedFilter?.filterOptions.includes(option)

  return (
    <SelectedFilterBox>
      <SelectedFilterNameBox>
        <h3 id={filterName.replace(/\s/g, '')}>{filterName}</h3>
      </SelectedFilterNameBox>
      <SelectedFilterOptionsBox>
        {filterOptions.map((option, index) => (
          <button
            key={index}
            className={isSelected(option) ? 'selected' : ''}
            onClick={handleClick(filterName, option)}
          >
            <span>{option}</span>
          </button>
        ))}
      </SelectedFilterOptionsBox>
    </SelectedFilterBox>
  )
}

type ChangeFiltersType = {
  targetFilter?: string
  toggleChangeFiltersPopup: ToggleChangeFiltersPopupType
}

// If the 'targetFilter' is provided, the component will only show the related values.
// If not, it will show all the values for all the filters.
export const ChangeFiltersPopup = ({
  targetFilter,
  toggleChangeFiltersPopup
}: ChangeFiltersType) => {
  const { category } = useParams() as { category: PartsCategoriesType }
  const filters = useSelector(selectFilters)[category] || []
  const selectedFilters = useSelector(selectSelectedFilters)[category] || []
  // Clone the selectedFilters to avoid mutating the state
  const [clonedSelectedFilters, setClonedSelectedFilters] = useState(
    structuredClone(selectedFilters)
  )
  // Extract filter names for the side menu
  const filterNames = filters.map(
    filter => filter.category || filter.subCategory
  ) as string[]

  const dispatch = useDispatch()
  const handleConfirmClick = useCallback(() => {
    // Update the selectedFilters in the store
    dispatch(
      setFilterOptions({ category, filterOptions: clonedSelectedFilters })
    )
    // Close the popup
    toggleChangeFiltersPopup(false)('')
  }, [category, clonedSelectedFilters, toggleChangeFiltersPopup])

  const handleCloseClick = useCallback(() => {
    // Close the popup
    toggleChangeFiltersPopup(false)('')
  }, [toggleChangeFiltersPopup])

  const handleFilterOptionClick = useCallback(
    (filterName: string, option: string) => () => {
      const oldOptions =
        clonedSelectedFilters.find(
          selectedFilter => selectedFilter.filterName === filterName
        )?.filterOptions || []

      const newOptions = oldOptions?.includes(option)
        ? // Remove the option if it's already selected.
          // And return spliced array
          oldOptions.splice(oldOptions.indexOf(option), 1) && oldOptions
        : // Add the option if it's not selected
          [...oldOptions, option]

      const isNew = !clonedSelectedFilters.find(
        selectedFilter => selectedFilter.filterName === filterName
      )

      // If it's a new filter, add it to the selectedFilters
      if (isNew) {
        setClonedSelectedFilters([
          ...clonedSelectedFilters,
          { filterName, filterOptions: newOptions }
        ])
        return
      }
      // If it's not a new filter, update the options
      else {
        const newSelectedFilters = clonedSelectedFilters.map(selectedFilter => {
          if (selectedFilter.filterName === filterName) {
            return { filterName, filterOptions: newOptions }
          }
          return selectedFilter
        })
        setClonedSelectedFilters(newSelectedFilters)
      }
    },
    [selectedFilters, clonedSelectedFilters, setClonedSelectedFilters]
  )

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

  // When modal is open, hide the scrollbar
  // and compensate for the scrollbar width
  useScrollbarPadding()
  const scrollbarWidth = useScrollbarWidth()

  return (
    <PopupLayout onConfirm={handleConfirmClick} onClose={handleCloseClick}>
      <Box targetFilter={targetFilter} scrollbarWidth={scrollbarWidth}>
        <SelectedFiltersSectionBox>
          {filtersToShow.map(({ category, subCategory, values }, index) => (
            <SelectedFilter
              key={index}
              filterName={(category || subCategory) as string}
              filterOptions={values}
              selectedFilters={clonedSelectedFilters}
              handleClick={handleFilterOptionClick}
            />
          ))}
        </SelectedFiltersSectionBox>
      </Box>
      {/* Show sidebar only when showing the entire filters */}
      {!targetFilter ? <SideMenu filterNames={filterNames} /> : null}
    </PopupLayout>
  )
}
