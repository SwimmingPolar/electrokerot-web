import { createSlice } from '@reduxjs/toolkit'
import {
  PartsState,
  SetBackupFilterOptionValuesType,
  SetFilterOptionsType,
  SetFiltersType,
  ToggleFilterOptionsType,
  ToggleFilterType,
  ToggleSubFilterType
} from 'features'

const initialState: PartsState = {
  // Filters data
  filters: {},
  // Selected filters
  selectedFilters: {
    backup: {}
  },
  // Open/Close state of filters
  filtersState: {}
}

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    // Save the filters data
    setFilters: (state, { payload: { category, filters } }: SetFiltersType) => {
      state.filters[category] = filters
    },
    // Set new filter options for the entire category
    setFilterOptions: (
      state,
      { payload: { category, filterOptions } }: SetFilterOptionsType
    ) => {
      state.selectedFilters[category] = filterOptions
    },
    setBackupFilterOptionValues: (
      state,
      {
        payload: { category, filterName, filterOptions }
      }: SetBackupFilterOptionValuesType
    ) => {
      // Get the index of the filter option
      const indexOfBackupSelectedFilter = state.selectedFilters.backup?.[
        category
      ]?.findIndex(filter => filter.filterName === filterName)

      // Remove the previous filter option values if any
      if (indexOfBackupSelectedFilter !== undefined) {
        state.selectedFilters.backup[category]?.splice(
          indexOfBackupSelectedFilter,
          1
        )
      }

      // Save the new filter option values
      state.selectedFilters.backup[category] = [
        ...(state.selectedFilters.backup?.[category] || []),
        {
          filterName,
          filterOptions
        }
      ]
    },
    // Check/uncheck the filter options
    toggleFilterOptions: (
      state,
      {
        payload: {
          category,
          filterOptions: { filterName, filterOptions }
        }
      }: ToggleFilterOptionsType
    ) => {
      // Find an index of a matching filter option
      const selectedFilterIndex = state.selectedFilters[category]?.findIndex(
        selectedFilter => selectedFilter.filterName === filterName
      )

      // If no matching filter option is found, add it to the state
      if (selectedFilterIndex === undefined || selectedFilterIndex === -1) {
        state.selectedFilters[category] = [
          ...(state.selectedFilters[category] || []),
          {
            filterName,
            filterOptions
          }
        ]
      }
      // If a matching filter option is found, update it in the state
      else {
        // Get the current selected options by the index
        const selectedOptions =
          state.selectedFilters[category]?.[selectedFilterIndex]
            .filterOptions || []

        // Iterate over the filter options that the user selected and
        // check/uncheck them from the selected options
        filterOptions.forEach(userSelection => {
          // If the options that the user selected is already in the selected options,
          // it means that the user is unchecking it and vice versa
          // const isChecked = selectedOptions.includes(userSelection)
          const isChecked = selectedOptions.includes(userSelection)
          const isMinusChecked = selectedOptions.includes(`!!${userSelection}`)

          // 'userSelection' from action payload only contains original filters values
          // which means they don't have '!!' in front of them even if minus filter is checked.
          // But the selected options in the state have '!!' in front of them if minus filter
          // is checked. So, we need to add '!!' in front of the 'userSelection' to match the
          // selected options in the state.
          userSelection = isMinusChecked ? `!!${userSelection}` : userSelection
          const indexOfSelectedOption = selectedOptions.indexOf(userSelection)

          // If it's already checked, uncheck it
          if (isChecked) {
            selectedOptions[indexOfSelectedOption] = `!!${userSelection}`
          } else if (isMinusChecked) {
            selectedOptions.splice(selectedOptions.indexOf(userSelection), 1)
          }
          // If not checked, check it
          else {
            selectedOptions.push(userSelection)
          }
        })
      }
    },
    // Open/close the filter
    toggleFilter: (state, { payload: { category } }: ToggleFilterType) => {
      const open = state.filtersState[category]?.open
      state.filtersState[category] = Object.assign(
        // Prepare empty object to avoid mutating the state
        {},
        // Copy the current state
        state.filtersState?.[category],
        // Change the open state to the opposite
        {
          open: !open
        }
      )
    },
    // Open/close the sub-filter
    toggleSubFilter: (
      state,
      { payload: { category, subFilter } }: ToggleSubFilterType
    ) => {
      const open = state.filtersState?.[category]?.subFilters?.[subFilter]
      state.filtersState[category] = Object.assign(
        // Prepare empty object to avoid mutating the state
        {},
        // Copy the current state
        state.filtersState[category],
        // Change the open state of the sub-filter to the opposite
        {
          subFilters: Object.assign(
            {},
            state?.filtersState?.[category]?.subFilters,
            {
              [subFilter]: !open
            }
          )
        }
      )
    }
  }
})

export const {
  setFilters,
  setFilterOptions,
  setBackupFilterOptionValues,
  toggleFilterOptions,
  toggleFilter,
  toggleSubFilter
} = partsSlice.actions

const selectFilters = ({ parts: { filters } }: { parts: PartsState }) => filters
const selectSelectedFilters = ({
  parts: { selectedFilters }
}: {
  parts: PartsState
}) => selectedFilters
const selectFiltersState = ({
  parts: { filtersState }
}: {
  parts: PartsState
}) => filtersState

export { selectFilters, selectSelectedFilters, selectFiltersState }

export const PartsReducer = partsSlice.reducer
