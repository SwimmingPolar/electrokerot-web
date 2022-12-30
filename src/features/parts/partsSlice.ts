import { createSlice } from '@reduxjs/toolkit'
import { PartsState, SetFilterOptionsType, SetFiltersType } from 'features'

const initialState: PartsState = {
  filters: {},
  selectedFilters: {}
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
      { payload: { category, filterOptions } }: SetFilterOptionsType
    ) => {
      state.selectedFilters[category] = filterOptions
    }
  }
})

export const { setFilters } = partsSlice.actions

const selectFilters = ({ parts: { filters } }: { parts: PartsState }) => filters
const selectSelectedFilters = ({
  parts: { selectedFilters }
}: {
  parts: PartsState
}) => selectedFilters

export { selectFilters, selectSelectedFilters }

export const PartsReducer = partsSlice.reducer
