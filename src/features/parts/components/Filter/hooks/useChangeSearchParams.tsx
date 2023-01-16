import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import {
  selectFilters,
  selectIsFilterUpdating,
  setFilterOptions
} from 'features'
import { useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const sortFilters = (
  filterNames: string[],
  filters: {
    [key: string]: string[]
  }[]
) => {
  const cloned = structuredClone(filters)
    .filter(
      e =>
        e &&
        // Remove filters with empty options
        e[Object.keys(e)[0]].length !== 0 &&
        // Remove filters that are not in the trustable filter names list
        filterNames.includes(Object.keys(e)[0])
    )
    // Sort the filters by their name
    .sort((a, b) =>
      new Intl.Collator(['en', 'ko'], {
        numeric: true
      }).compare(Object.keys(a)[0], Object.keys(b)[0])
    )
  // Sort the options by their name
  cloned.forEach(e =>
    Object.values(e)[0].sort(
      new Intl.Collator(['en', 'ko'], {
        numeric: true
      }).compare
    )
  )

  return cloned
}

export const useChangeSearchParams = () => {
  const dispatch = useDispatch()

  // Get selected filters from redux store
  const { category } = useParams() as { category: PartsCategoriesType }

  // Get search params from url
  const [searchParams, setSearchParams] = useSearchParams()

  const filter = useSelector(selectFilters)[category]
  const { query, page, filterData } = filter

  const filterNames = useMemo(
    () =>
      filterData.map(
        filter => filter?.category || (filter?.subCategory as string)
      ),
    [filterData]
  )

  // Get the selected filters from the store
  const selectedFilters = filter?.selectedFilters || []
  // Reformat it to the same format as the filters from the url
  const filtersFromStore = useMemo(
    () =>
      sortFilters(
        filterNames,
        selectedFilters.reduce<{ [key: string]: string[] }[]>(
          (acc, filter) => [
            ...acc,
            { [filter.filterName]: filter.filterOptions }
          ],
          []
        )
      ),
    [selectedFilters]
  )

  // Watch for changes in the order of the filters name and options
  // Sample: filterB=B_AMD,A_AMD&filterA=AMD,인텔
  const filtersFromUrl = useMemo(() => {
    const temp = Array.from(searchParams.keys())
      // Filter out the search params that are not related to filters
      .filter(key => {
        if (['query', 'page'].includes(key)) {
          return false
        }
        return true
      })
      // Extract the filter options from the search params
      .reduce<
        {
          [key in string]: string[]
        }[]
      >((acc, key) => {
        key = decodeURI(key)
        return [
          ...acc,
          {
            [key]:
              searchParams
                .get(key)
                ?.split(',')
                ?.map(e => decodeURI(e)) || []
          }
        ]
      }, [])
    // Input: filterB=B_AMD,A_AMD&filterA=AMD,인텔
    // Output: [{filterA: ['AMD', '인텔']}, {filterB: ['A_AMD', 'B_AMD']}]
    return sortFilters(filterNames, temp)
  }, [selectedFilters])

  // Check if the filter is updating
  const isFilterUpdating = useSelector(selectIsFilterUpdating)

  useEffect(
    () => {
      const isEqual =
        // Since they are both trimmed and sorted, we can compare them by stringifying them.
        JSON.stringify(filtersFromUrl) === JSON.stringify(filtersFromStore) &&
        page === Number(searchParams.get('page')) &&
        query === searchParams.get('query')

      // Compare parsed filters from url and the selected filters in the redux store
      // and if it's not same. Update the search params accordingly
      // Be sure to only update when they are not same
      // or else, it will cause infinite loop
      if (isEqual) {
        return
      }

      // If we are the one who's changing the search params by dispatching the actions
      if (isFilterUpdating) {
        const newSearchParams = filtersFromStore.reduce<{
          [key: string]: string
        }>((acc, filter) => {
          // Replace the spaces with %20
          const key = Object.keys(filter)[0].replace(/\s/g, '%20')
          // Replace the spaces with %20
          // and join the options with comma
          const value = filter[key].map(e => e.replace(/\s/g, '%20')).join(',')
          return {
            ...acc,
            [key]: value
          }
        }, {})

        // Set new search params
        setSearchParams(new URLSearchParams(newSearchParams), {
          replace: true
        })
      }
      // If the user is changing the search params through the url
      else {
        // Reconstruct the selected filters from the search params
        const newSelectedFilters = filtersFromUrl.reduce<
          {
            filterName: string
            filterOptions: string[]
          }[]
        >((acc, filter) => {
          const key = Object.keys(filter)[0]
          const values = filter[key]
          return [
            ...acc,
            {
              filterName: key,
              filterOptions: values
            }
          ]
        }, [])

        dispatch(
          setFilterOptions({ category, filterOptions: newSelectedFilters })
        )
      }

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
    [category, selectedFilters, searchParams]
  )
}
