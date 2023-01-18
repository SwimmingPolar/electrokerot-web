import { useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { SelectedFiltersType, selectFilters } from 'features'
import { useDebouncedValue } from 'hooks'
import { useDeferredValue, useMemo } from 'react'
import { useParams } from 'react-router-dom'

const DebounceTime = 650

export type SearchOptionsType = {
  category: PartsCategoriesType
  query?: string
  page?: number
  selectedFilters: SelectedFiltersType[]
}

export const useSearchOptions = () => {
  // Extract the category from the url
  const { category } = useParams() as { category: PartsCategoriesType }

  // Get the related filters meta information
  const filters = useSelector(selectFilters)[category]

  // Reconstruct the search options out of the filters meta information
  const searchOptions = useMemo<SearchOptionsType>(
    () => ({
      category,
      query: filters.query,
      page: filters.page,
      selectedFilters: filters.selectedFilters
    }),
    [category, filters.query, filters.page, filters.selectedFilters]
  )

  // Debounce the search options
  const debouncedSearchOptions = useDebouncedValue(searchOptions, DebounceTime)

  // Defer the search options
  const deferredSearchOptions = useDeferredValue(debouncedSearchOptions)

  return deferredSearchOptions
}
