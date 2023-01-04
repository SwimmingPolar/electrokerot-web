import { PartsCategoriesType } from 'constant'

export type FilterValuesType = {
  category?: string
  subCategory?: string
  values: string[]
}

export type FiltersType = {
  [key in PartsCategoriesType]?: FilterValuesType[]
}

export type SelectedFiltersElementType = {
  filterName: string
  filterOptions: string[]
}

export type SelectedFiltersType = {
  [key in PartsCategoriesType]?: SelectedFiltersElementType[]
}

export type FiltersStateType = {
  [key in PartsCategoriesType]?: {
    open: boolean
    subFilters: {
      [key: string]: boolean
    }
  }
}

// State type
export type PartsState = {
  filters: FiltersType
  filtersState: FiltersStateType
  selectedFilters: SelectedFiltersType
}

// Reducer argument types
export type SetFiltersType = {
  payload: {
    category: PartsCategoriesType
    filters: FilterValuesType[]
  }
}

export type SetFilterOptionsType = {
  payload: {
    category: PartsCategoriesType
    filterOptions: SelectedFiltersElementType[]
  }
}

export type ToggleFilterOptionsType = {
  payload: {
    category: PartsCategoriesType
    filterOptions: {
      filterName: string
      filterOptions: string[]
    }
  }
}

export type ToggleFilterType = {
  payload: {
    category: PartsCategoriesType
  }
}

export type ToggleSubFilterType = {
  payload: {
    category: PartsCategoriesType
    subFilter: string
  }
}
