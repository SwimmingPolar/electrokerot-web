import { PartsCategoriesType } from 'constant'

export type FilterValuesType = {
  category?: string
  subCategory?: string
  values: string[]
  matchingType?: 'exact' | 'contains' | 'range' | 'max' | 'min'
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
} & {
  backup: {
    [key in PartsCategoriesType]?: SelectedFiltersElementType[]
  }
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
    filterOptions: {
      filterName: string
      filterOptions: string[]
    }[]
  }
}

export type SetBackupFilterOptionValuesType = {
  payload: {
    category: PartsCategoriesType
    filterName: string
    filterOptions: string[]
  }
}

export type ToggleFilterOptionsType = {
  payload: {
    category: PartsCategoriesType
    filterName: string
    filterOption: string
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
