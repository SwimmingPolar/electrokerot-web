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
import { useToggleFilterOptions } from '../Filter/hooks/useToggleFilterOptions'
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
  display: flex;
  button {
    cursor: pointer;
    width: fit-content;

    &:hover {
      h3 {
        text-decoration: underline;
      }
    }
  }
  h3 {
    display: inline-flex;
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
  button.selected.minus {
    background-color: ${({ theme }) => theme.colors.red};

    span {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`

type SelectedFiltersSectionType = {
  filterName: string
  filterOptions: string[]
  selectedFilters: SelectedFiltersElementType[]
  handleClick: (filterName: string, filterOption: string) => () => void
  handleFilterNameClick: (filterName: string) => void
}

const SelectedFilter = ({
  filterName,
  filterOptions,
  selectedFilters,
  handleClick: handleOptionClick,
  handleFilterNameClick
}: SelectedFiltersSectionType) => {
  // Extract the selected options for the filter
  const selectedFilter = selectedFilters.find(
    selectedFilter => selectedFilter.filterName === filterName
  )

  const getFilterState = (option: string) => {
    const isChecked = selectedFilter?.filterOptions.includes(option)
    const isMinusChecked = selectedFilter?.filterOptions.includes(`!!${option}`)

    if (isChecked) {
      return 'selected'
    } else if (isMinusChecked) {
      return 'selected minus'
    } else {
      return ''
    }
  }

  return (
    <SelectedFilterBox>
      <SelectedFilterNameBox>
        <button onClick={() => handleFilterNameClick(filterName)}>
          <h3
            id={filterName.replace(
              /([^ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z]|^\d*(?=\D))/g,
              ''
            )}
          >
            {filterName}
          </h3>
        </button>
      </SelectedFilterNameBox>
      <SelectedFilterOptionsBox>
        {filterOptions.map((option, index) => (
          <button
            key={index}
            className={getFilterState(option)}
            onClick={handleOptionClick(filterName, option)}
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
  const [backupSelectedFilters, setBackupSelectedFilters] = useState<{
    [key: string]: string[]
  }>({})

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
      // Clone the selectedFilters to avoid mutating the state
      const oldOptions = structuredClone(
        clonedSelectedFilters.find(
          selectedFilter => selectedFilter.filterName === filterName
        )?.filterOptions || []
      )

      // const newOptions = oldOptions?.includes(option)
      //   ? // Remove the option if it's already selected.
      //     // And return spliced array
      //     oldOptions.splice(oldOptions.indexOf(option), 1) && oldOptions
      //   : // Add the option if it's not selected
      //     [...oldOptions, option]

      let newOptions: string[]
      // If minus filter is selected, remove the option from the selectedFilters. (if statement order matters)
      if (oldOptions.includes(`!!${option}`)) {
        newOptions =
          oldOptions.splice(oldOptions.indexOf(`!!${option}`), 1) && oldOptions
      }
      // If the option is selected and already exists in the selectedFilters
      // it means toggling minus filter. So, add the minus filter to the selectedFilters.
      else if (oldOptions.includes(option)) {
        // Remove 'selected' filter from the list
        oldOptions.splice(oldOptions.indexOf(option), 1)
        // And add 'minus' filter to the list
        newOptions = [...oldOptions, `!!${option}`]
      } else {
        newOptions = [...oldOptions, option]
      }

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

  const handleFilterNameClick = useCallback(
    (filterName: string) => {
      // Extract original data for the filter
      const values =
        filters?.find(
          filter =>
            filter.category === filterName || filter.subCategory === filterName
        )?.values || []
      // Extract user selected values for the filter
      const clonedSelectedValues =
        clonedSelectedFilters?.find(
          selectedFilter => selectedFilter.filterName === filterName
        )?.filterOptions || []

      // Check if all the options are selected
      const isAllSelected =
        // To know if all the options are selected, check if the length
        // of the selected values is the same as the length of the values
        clonedSelectedValues.length === values.length &&
        // And make sure none of the values are minus filters.
        clonedSelectedValues.every(value => !/^!!.+/.test(value))

      // Check if all the options are minus selected
      const isAllMinusSelected =
        clonedSelectedValues.length === values.length &&
        clonedSelectedValues.every(value => /^!!.+/.test(value))

      // Check if no options are selected
      const isNotSelectedAtAll = clonedSelectedValues.length === 0

      console.log('isAllSelected', isAllSelected)
      console.log('isAllMinusSelected', isAllMinusSelected)
      console.log('isNotSelectedAtAll', isNotSelectedAtAll)

      let newSelectedValues: string[]
      // If all are selected, turn into all minus selected
      if (isAllSelected) {
        newSelectedValues = values.map(value => '!!' + value)
      }
      // If all are minus selections, unselect all
      else if (isAllMinusSelected) {
        newSelectedValues = []
      }
      // If no options are selected, restore from backup
      else if (isNotSelectedAtAll) {
        const backupValues = backupSelectedFilters[filterName] || []
        newSelectedValues = backupValues.length === 0 ? values : backupValues
      }
      // If options are sparsely selected, select all
      // And save currently selected values to backup in the store.
      else {
        newSelectedValues = values
        setBackupSelectedFilters({
          ...backupSelectedFilters,
          [filterName]: clonedSelectedValues
        })
      }

      const clonedFilterIndex = clonedSelectedFilters.findIndex(
        filter => filter.filterName === filterName
      )
      setClonedSelectedFilters(prevClonedSelectedFilters => {
        if (clonedFilterIndex !== -1) {
          prevClonedSelectedFilters.splice(clonedFilterIndex, 1)
        }
        prevClonedSelectedFilters = [
          ...prevClonedSelectedFilters,
          { filterName, filterOptions: newSelectedValues }
        ]

        return prevClonedSelectedFilters
      })
    },
    [
      category,
      filters,
      selectedFilters,
      clonedSelectedFilters,
      backupSelectedFilters
    ]
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
              handleFilterNameClick={handleFilterNameClick}
            />
          ))}
        </SelectedFiltersSectionBox>
      </Box>
      {/* Show sidebar only when showing the entire filters */}
      {!targetFilter ? <SideMenu filterNames={filterNames} /> : null}
    </PopupLayout>
  )
}
