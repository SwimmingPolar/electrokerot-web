import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import {
  selectFilters,
  selectSelectedFilters,
  setBackupFilterOptionValues,
  setFilterOptions
} from 'features'
import { useCallback, useState } from 'react'

export const useToggleFilterOptions = (category: PartsCategoriesType) => {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)[category]
  // Entire selected filters data from the store
  const selectedFiltersWhole = useSelector(selectSelectedFilters)
  const selectedFilters = selectedFiltersWhole[category] || []

  const handleFilterNameClick = useCallback(
    (filterName: string) => {
      // Extract original data for the filter
      const values =
        filters?.find(
          filter =>
            filter.category === filterName || filter.subCategory === filterName
        )?.values || []
      // Extract user selected values for the filter
      const selectedValues =
        selectedFilters?.find(
          selectedFilter => selectedFilter.filterName === filterName
        )?.filterOptions || []

      // Check if all the options are selected
      const isAllSelected =
        // To know if all the options are selected, check if the length
        // of the selected values is the same as the length of the values
        selectedValues.length === values.length &&
        // And make sure none of the values are minus filters.
        selectedValues.every(value => !/^!!.+/.test(value))

      // Check if all the options are minus selected
      const isAllMinusSelected =
        selectedValues.length === values.length &&
        selectedValues.every(value => /^!!.+/.test(value))

      // Check if no options are selected
      const isNotSelectedAtAll = selectedValues.length === 0

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
        // Extract backup data for the filter
        const backupSelectedFilterValues =
          selectedFiltersWhole.backup?.[category]?.find(
            filter => filter.filterName === filterName
          )?.filterOptions || []

        newSelectedValues =
          backupSelectedFilterValues.length === 0
            ? values
            : backupSelectedFilterValues
      }
      // If options are sparsely selected, select all
      // And save currently selected values to backup in the store.
      else {
        newSelectedValues = values
        dispatch(
          setBackupFilterOptionValues({
            category,
            filterName,
            filterOptions: selectedValues
          })
        )
      }

      const filterIndex = selectedFilters.findIndex(
        filter => filter.filterName === filterName
      )
      // Clone the selected filters to avoid mutating the state
      const clonedSelectedFilters = structuredClone(selectedFilters)
      if (filterIndex !== -1) {
        clonedSelectedFilters.splice(filterIndex, 1)
      }

      // Set the new selected values
      dispatch(
        setFilterOptions({
          category,
          filterOptions: [
            ...clonedSelectedFilters,
            {
              filterName,
              filterOptions: newSelectedValues
            }
          ]
        })
      )
    },
    [category, filters, selectedFiltersWhole, selectedFilters]
  )

  return handleFilterNameClick
}
