import { PartsCategoriesType } from 'constant'

// Filter state
export type FilterState = {
  [key in PartsCategoriesType]: FilterType
}

export type FilterType = {
  filterData: FilterDataType[]
  filterState: FiltersStateType
  selectedFilters: SelectedFiltersType[]
  backupSelectedFilters: SelectedFiltersType[]
  query?: string
  page?: number
}

export type FilterDataType = {
  category?: string
  subCategory?: string
  values: string[]
  matchingType?: FilterMatchingType
}

export type FilterMatchingType = 'exact' | 'contains' | 'range' | 'max' | 'min'

export type SelectedFiltersType = {
  filterName: string
  filterOptions: string[]
}

export type FiltersStateType = {
  open?: boolean
  subFilters: {
    [key in string]?: boolean
  }
}

// Reducer argument types
export type SetFiltersType = {
  payload: {
    category: PartsCategoriesType
    filterData: FilterDataType[]
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

export type SetQueryType = {
  payload: {
    category: PartsCategoriesType
    query: string
  }
}

export type SetPageType = {
  payload: {
    category: PartsCategoriesType
    page: number
  }
}
