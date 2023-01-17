import { createSlice } from '@reduxjs/toolkit'
import { PartsCategoriesType } from 'constant'
import {
  FilterState,
  SetBackupFilterOptionValuesType,
  SetFilterOptionsType,
  SetFiltersType,
  SetPageType,
  SetQueryType,
  ToggleFilterOptionsType,
  ToggleFilterType,
  ToggleSubFilterType
} from './types'

const initialState: FilterState = {} as FilterState

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    // Save the filters data
    setFilters: (
      state,
      { payload: { category, filterData } }: SetFiltersType
    ) => {
      if (state[category] === undefined) {
        state[category] = {} as FilterState[typeof category]
      }

      state[category] = {
        ...state[category],
        filterData
      }
    },
    // Set new filter options for the entire filter name
    // @important: This will set _isFilterUpdating to true
    setFilterOptions: (
      state,
      { payload: { category, filterOptions } }: SetFilterOptionsType
    ) => {
      // Create an array for the category if it doesn't exist
      if (state[category] === undefined) {
        state[category] = {} as FilterState[typeof category]
      }
      if (state[category]?.selectedFilters === undefined) {
        state[category].selectedFilters = []
      }

      // If the length of the filter options is 0,
      // it means that the user is unchecking all the filter options
      if (filterOptions.length === 0) {
        state[category].selectedFilters = []
        return
      }

      // Iterate over the given filter options and update the state
      filterOptions.forEach(({ filterName, filterOptions }) => {
        const selectedFilter = state[category].selectedFilters?.find(
          selectedFilter => selectedFilter.filterName === filterName
        )
        if (selectedFilter === undefined) {
          state[category].selectedFilters?.push({
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
      if (state[category] === undefined) {
        state[category] = {} as FilterState[typeof category]
      }
      if (state[category].backupSelectedFilters === undefined) {
        state[category].backupSelectedFilters = []
      }

      const indexOfBackupSelectedFilter = state[
        category
      ].backupSelectedFilters?.findIndex(
        filter => filter.filterName === filterName
      )

      // Remove the previous filter option values if any
      if (indexOfBackupSelectedFilter !== undefined) {
        state[category].backupSelectedFilters?.splice(
          indexOfBackupSelectedFilter,
          1
        )
      }

      // Save the new filter option values
      state[category].backupSelectedFilters = [
        ...(state[category]?.backupSelectedFilters || []),
        {
          filterName,
          filterOptions
        }
      ]
    },
    // Check/uncheck the filter options
    // @important: This will set _isFilterUpdating to true
    toggleFilterOptions: (
      state,
      {
        payload: { category, filterName, filterOption }
      }: ToggleFilterOptionsType
    ) => {
      if (state[category] === undefined) {
        state[category] = {} as FilterState[typeof category]
      }
      if (state[category].selectedFilters === undefined) {
        state[category].selectedFilters = []
      }

      // Find an index of a matching filter option
      const selectedFilterIndex = state[category].selectedFilters?.findIndex(
        selectedFilter => selectedFilter.filterName === filterName
      )

      // If no matching filter option is found, add it to the state
      if (selectedFilterIndex === undefined || selectedFilterIndex === -1) {
        state[category].selectedFilters?.push({
          filterName,
          filterOptions: [filterOption]
        })
      }

      // If a matching filter option is found, update it in the state
      else {
        // Get the current selected options by the index
        const selectedOptions =
          state[category].selectedFilters?.[selectedFilterIndex]
            .filterOptions ||
          // There will always be an array of selected options
          // This is for typescript to not complain
          []

        // This is to check if the currently selected filter should have unique option or not.
        // Just like the radio button, it should only have one option selected at a time. (ex, 권장 파워용량)
        const filterOptionConfig = state[category].filterData.find(
          filter =>
            filter.category === filterName || filter.subCategory === filterName
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
      if (state[category] === undefined) {
        state[category] = {} as FilterState[typeof category]
      }
      if (state[category].filterState === undefined) {
        state[category].filterState = {
          subFilters: {}
        }
      }

      const open = state[category].filterState?.open
      state[category].filterState.open = !open
    },
    // Open/close the sub-filter
    toggleSubFilter: (
      state,
      { payload: { category, subFilter } }: ToggleSubFilterType
    ) => {
      if (state[category] === undefined) {
        state[category] = {} as FilterState[typeof category]
      }
      if (state[category].filterState === undefined) {
        state[category].filterState = {
          subFilters: {}
        }
      }

      const open = state[category].filterState?.subFilters?.[subFilter]
      state[category].filterState.subFilters[subFilter] = !open
    },
    // It sets
    setQuery: (state, { payload: { category, query } }: SetQueryType) => {
      if (state[category] === undefined) {
        state[category] = {} as FilterState[typeof category]
      }
    },
    setPage: (state, { payload: { category, page } }: SetPageType) => {
      //
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
} = filterSlice.actions

const selectFilters = ({ filter }: { filter: FilterState }) =>
  Object.entries(filter)
    // Filter out meta data from the filter state
    .filter(([key, _]) => !key.startsWith('_'))
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value
      }),
      {} as {
        [key in PartsCategoriesType]: FilterState[key]
      }
    )

export { selectFilters }

export const FilterReducer = filterSlice.reducer
