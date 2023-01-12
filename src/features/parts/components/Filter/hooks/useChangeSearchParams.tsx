import { useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { selectSelectedFilters } from 'features'
import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

type SearchParamsType = {
  category: PartsCategoriesType
  page?: number
  query?: string
  filters?: Record<string, string[]>
}

export const useChangeSearchParams = () => {
  // Get search params from url
  const [searchParams, setSearchParams] = useSearchParams()
  // Get selected filters from redux store
  const { category } = useParams() as { category: PartsCategoriesType }
  const selectedFilters = useSelector(selectSelectedFilters)[category]

  useEffect(
    () => {
      const newSelectedFilters = structuredClone(selectedFilters || [])
        // Remove empty filters with empty options
        .filter(e => e.filterOptions.length !== 0)
        // Transform the filter options to valid format
        .reduce(
          (acc, { filterName, filterOptions }) => ({
            ...acc,
            [filterName]: filterOptions
          }),
          {}
        )
      // If no options are selected, remove the filter from the search params
      if (Object.keys(newSelectedFilters).length === 0) {
        searchParams.delete('filters')
      } else {
        searchParams.set(
          'filters',
          encodeURIComponent(JSON.stringify(newSelectedFilters))
        )
      }
      setSearchParams(new URLSearchParams(searchParams), {
        replace: true
      })
    },
    // Every time the filters change, update the search params
    [selectedFilters]
  )
}
