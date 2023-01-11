import { SelectChangeEvent } from '@mui/material'
import { useDispatch, useSelector } from 'app'
import { PopupLayout } from 'components'
import { ChangeFilterPopupDimension, PartsCategoriesType } from 'constant'
import {
  selectFilters,
  selectSelectedFilters,
  setFilterOptions,
  ToggleChangeFiltersPopupType
} from 'features'
import { useScrollbarPadding, useScrollbarWidth } from 'hooks'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { FiltersList, PopupHeader, SideMenu } from './components'

const Box = styled.div<{ targetFilter?: string; scrollbarWidth: number }>`
  /* Without 'targetFilter', make the modal smaller */
  display: flex;
  width: ${({ targetFilter }) =>
    !targetFilter
      ? `${ChangeFilterPopupDimension.withoutTargetFilter.default.width}px`
      : `${ChangeFilterPopupDimension.withTargetFilter.default.width}px`};
  height: ${({ targetFilter }) =>
    !targetFilter
      ? `${ChangeFilterPopupDimension.withoutTargetFilter.default.height}px`
      : `${ChangeFilterPopupDimension.withTargetFilter.default.height}px`};
  background-color: ${({ theme }) => theme.colors.white};
  position: relative;
  /* Popup layout has double negative margin-right to hide scrollbar for popup itself
     and the scrollbar for the side menu. On individual filter, it does not
     have side menu hence, no scrollbar neither.
     So we have to compensate for this double negative margin-right */
  padding-right: ${({ targetFilter, scrollbarWidth }) =>
    !targetFilter ? '0px' : scrollbarWidth + 'px'};
`

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
  const dispatch = useDispatch()
  // Extract the category for the current page
  const { category: categoryParam } = useParams() as {
    category: PartsCategoriesType
  }
  const [category, setCategory] = useState(categoryParam)
  // Get filters data
  const filters = useSelector(selectFilters)[category] || []
  // Get selected filters
  const selectedFiltersWithAllCategory = useSelector(selectSelectedFilters)
  const selectedFilters = selectedFiltersWithAllCategory[category] || []
  // Clone the selectedFilters to avoid mutating the state
  const [clonedSelectedFilters, setClonedSelectedFilters] = useState(
    structuredClone(selectedFilters)
  )
  // Temporary backup state for the selected filters to be able to handle the changes
  // without altering the selected filters data in the store
  const [backupSelectedFilters, setBackupSelectedFilters] = useState<{
    [key: string]: string[]
  }>({})

  // Extract filter names for the side menu
  const filterNames = filters.map(
    filter => filter.category || filter.subCategory
  ) as string[]

  // Handler for the confirm button
  const handleConfirmClick = useCallback(() => {
    // Update the selectedFilters in the store
    dispatch(
      setFilterOptions({ category, filterOptions: clonedSelectedFilters })
    )
    // Close the popup
    toggleChangeFiltersPopup(false)('')
  }, [category, clonedSelectedFilters, toggleChangeFiltersPopup])

  // Handler for the cancel/close button
  const handleCloseClick = useCallback(() => {
    // Close the popup
    toggleChangeFiltersPopup(false)('')
  }, [toggleChangeFiltersPopup])

  // Handler for when the user clicks on the filter name in the section header
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
        // Clone the previous cloned selected filters to avoid mutating the state
        let newClonedSelectedFilters = structuredClone(
          prevClonedSelectedFilters
        )
        if (clonedFilterIndex !== -1) {
          newClonedSelectedFilters.splice(clonedFilterIndex, 1)
        }
        newClonedSelectedFilters = [
          ...newClonedSelectedFilters,
          { filterName, filterOptions: newSelectedValues }
        ]

        return newClonedSelectedFilters
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

  // Handler for when the user clicks on the individual filter options
  const handleFilterOptionClick = useCallback(
    (filterName: string, option: string) => () => {
      // Clone the selectedFilters to avoid mutating the state
      const oldOptions = structuredClone(
        clonedSelectedFilters.find(
          selectedFilter => selectedFilter.filterName === filterName
        )?.filterOptions || []
      )

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

  // Handler for when the user change the category
  const handleChangeCategory = useCallback(
    (event: SelectChangeEvent) => {
      const newCategory = event.target.value as PartsCategoriesType
      // When changing category, set temporary selected filters to the original selected filters
      dispatch(
        setFilterOptions({ category, filterOptions: clonedSelectedFilters })
      )

      // Reset process
      setClonedSelectedFilters(
        // Set the value of cloned selected filters to the selected filters of the new category
        structuredClone(selectedFiltersWithAllCategory[newCategory] || [])
      )
      setBackupSelectedFilters({})

      // Change the category
      setCategory(event.target.value as PartsCategoriesType)
    },
    [category, clonedSelectedFilters, selectedFiltersWithAllCategory]
  )

  // Handler for when the user clicks on the reset whole filters button
  const handleResetFilters = useCallback(() => {
    const isAnyFilterOn = clonedSelectedFilters.length > 0

    // If any filter is on, save currently selected filters to backup.
    // And reset the cloned selected filters to empty.
    if (isAnyFilterOn) {
      const backupSelectedFilters = clonedSelectedFilters.reduce(
        (acc, { filterName, filterOptions }) => ({
          ...acc,
          [filterName]: filterOptions
        }),
        {} as { [key: string]: string[] }
      )

      setBackupSelectedFilters(backupSelectedFilters)
      setClonedSelectedFilters([])
    }

    // If no filter is on, restore from backup
    // And reset backup to empty.
    else {
      const restoredSelectedFilters = Object.entries(backupSelectedFilters).map(
        ([filterName, filterOptions]) => ({
          filterName,
          filterOptions
        })
      )

      setClonedSelectedFilters(restoredSelectedFilters)
      setBackupSelectedFilters({})
    }
  }, [clonedSelectedFilters, backupSelectedFilters])

  // When modal is open, hide the scrollbar
  // and compensate for the scrollbar width
  useScrollbarPadding()
  const scrollbarWidth = useScrollbarWidth()

  return (
    <PopupLayout onConfirm={handleConfirmClick} onClose={handleCloseClick}>
      <Box targetFilter={targetFilter} scrollbarWidth={scrollbarWidth}>
        <PopupHeader
          targetFilter={targetFilter}
          category={category}
          handleChangeCategory={handleChangeCategory}
          handleResetFilters={handleResetFilters}
        />
        <FiltersList
          targetFilter={targetFilter}
          filters={filters}
          selectedFilters={clonedSelectedFilters}
          handleFilterNameClick={handleFilterNameClick}
          handleFilterOptionClick={handleFilterOptionClick}
        />
      </Box>
      <SideMenu
        targetFilter={targetFilter}
        filterNames={filterNames}
        selectedFilters={clonedSelectedFilters}
      />
    </PopupLayout>
  )
}
