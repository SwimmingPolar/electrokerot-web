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
    // Set new filter options for the entire filter name
    setFilterOptions: (
      state,
      { payload: { category, filterOptions } }: SetFilterOptionsType
    ) => {
      // Create an array for the category if it doesn't exist
      if (state.selectedFilters[category] === undefined) {
        state.selectedFilters[category] = []
      }

      // If the length of the filter options is 0,
      // it means that the user is unchecking all the filter options
      if (filterOptions.length === 0) {
        state.selectedFilters[category] = []
        return
      }

      // Iterate over the given filter options and update the state
      filterOptions.forEach(({ filterName, filterOptions }) => {
        const selectedFilter = state.selectedFilters[category]?.find(
          selectedFilter => selectedFilter.filterName === filterName
        )
        if (selectedFilter === undefined) {
          state.selectedFilters[category]?.push({
            filterName,
            filterOptions
          })
        } else {
          selectedFilter.filterOptions = filterOptions
        }
      })
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
        payload: { category, filterName, filterOption }
      }: ToggleFilterOptionsType
    ) => {
      // Find an index of a matching filter option
      const selectedFilterIndex = state.selectedFilters[category]?.findIndex(
        selectedFilter => selectedFilter.filterName === filterName
      )

      // If no matching filter option is found, add it to the state
      if (selectedFilterIndex === undefined || selectedFilterIndex === -1) {
        if (state.selectedFilters[category] === undefined) {
          state.selectedFilters[category] = []
        }
        state.selectedFilters[category]?.push({
          filterName,
          filterOptions: [filterOption]
        })
      }

      // If a matching filter option is found, update it in the state
      else {
        // Get the current selected options by the index
        const selectedOptions =
          state.selectedFilters[category]?.[selectedFilterIndex]
            .filterOptions ||
          // There will always be an array of selected options
          // This is for typescript to not complain
          []

        // This is to check if the currently selected filter should have unique option or not.
        // Just like the radio button, it should only have one option selected at a time. (ex, 권장 파워용량)
        const filterOptionConfig = state.filters[category]?.find(
          filter =>
            filter?.category === filterName ||
            filter?.subCategory === filterName
        )
        // Check if the filter option should have unique option or not
        const shouldUniqueOption =
          filterOptionConfig?.matchingType === 'max' ||
          filterOptionConfig?.matchingType === 'min'
        // Check if the filter option has other options already selected (probably only one option already selected at this time)
        const hasOtherOptions = selectedOptions.length >= 1
        // Check if the filter option that's already selected is not the same as the new filter option
        // which means that the user is selecting a new option hence, we should remove the old option
        const isNotSameValue = !selectedOptions.every(selectedOption =>
          new RegExp(filterOption, 'i').test(selectedOption)
        )
        if (shouldUniqueOption && hasOtherOptions && isNotSameValue) {
          // Remove all other options if there are any
          // and add the new option
          selectedOptions.splice(0, selectedOptions.length, filterOption)
          return
        }

        // If the options that the user selected is already in the selected options,
        // it means that the user is unchecking it and vice versa
        // const isChecked = selectedOptions.includes(userSelection)
        const isChecked = selectedOptions.includes(filterOption)
        const isMinusChecked = selectedOptions.includes(`!!${filterOption}`)

        // 'userSelection' from action payload only contains original filters values
        // which means they don't have '!!' in front of them even if minus filter is checked.
        // But the selected options in the state have '!!' in front of them if minus filter
        // is checked. So, we need to add '!!' in front of the 'userSelection' to match the
        // selected options in the state.
        const newlySelectedOption = isMinusChecked
          ? `!!${filterOption}`
          : filterOption
        const indexOfSelectedOption =
          selectedOptions.indexOf(newlySelectedOption)

        // If it's already checked, minus check it
        if (isChecked) {
          selectedOptions[indexOfSelectedOption] = `!!${filterOption}`
        }
        // If it's already minus checked, uncheck it
        else if (isMinusChecked) {
          selectedOptions.splice(
            selectedOptions.indexOf(`!!${filterOption}`),
            1
          )
        }
        // If not checked, check it
        else {
          selectedOptions.push(filterOption)
        }
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
