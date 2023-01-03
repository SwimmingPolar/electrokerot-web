import { createSlice } from '@reduxjs/toolkit'
import {
  PartsState,
  SetFilterOptionsType,
  SetFiltersType,
  ToggleFilterType,
  ToggleSubFilterType
} from 'features'

const initialState: PartsState = {
  // Filters data
  filters: {},
  // Selected filters
  selectedFilters: {},
  // Open/Close state of filters
  filtersState: {}
}

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    setFilters: (state, { payload: { category, filters } }: SetFiltersType) => {
      state.filters[category] = filters
    },
    setFilterOptions: (
      state,
      {
        payload: {
          category,
          filterOptions: { filterName, filterOptions }
        }
      }: SetFilterOptionsType
    ) => {
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
      } else {
        const selectedOptions =
          state.selectedFilters[category]?.[selectedFilterIndex]
            .filterOptions || []

        filterOptions.forEach(userSelection => {
          const isChecked = selectedOptions.includes(userSelection)

          if (isChecked) {
            selectedOptions.splice(selectedOptions.indexOf(userSelection), 1)
          } else {
            selectedOptions.push(userSelection)
          }
        })

        state.selectedFilters?.[category]?.splice(selectedFilterIndex, 1)

        state.selectedFilters?.[category]?.push({
          filterName,
          filterOptions: selectedOptions
        })
      }
    },
    toggleFilter: (state, { payload: { category } }: ToggleFilterType) => {
      const open = state.filtersState[category]?.open
      state.filtersState[category] = Object.assign(
        {},
        state.filtersState?.[category],
        {
          open: !open
        }
      )
    },
    toggleSubFilter: (
      state,
      { payload: { category, subFilter } }: ToggleSubFilterType
    ) => {
      const open = state.filtersState?.[category]?.subFilters?.[subFilter]
      state.filtersState[category] = Object.assign(
        {},
        state.filtersState[category],
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

export const { setFilters, setFilterOptions, toggleFilter, toggleSubFilter } =
  partsSlice.actions

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
