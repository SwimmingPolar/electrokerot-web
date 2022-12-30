import { PartsCategoriesType } from 'constant'

export type FilterValuesType = {
  category?: string
  subCategory?: string
  values: string[]
}

export type FiltersType = {
  [key in PartsCategoriesType]?: FilterValuesType[]
}

export type SelectedFiltersType = {
  [key in PartsCategoriesType]?: {
    filterName: string
    filterOptions: string[]
  }[]
}

// State type
export type PartsState = {
  filters: FiltersType
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
    filterOptions: {
      filterName: string
      filterOptions: string[]
    }[]
  }
}
