import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { loadJson, selectFilters, setFilterOptions } from 'features'
import { useIsDirectAccess } from 'hooks'
import { useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

// This has to be a async function because we need to wait for
// the filter data if it is not loaded yet.
const sortFilters = async (
  category: PartsCategoriesType,
  filterNames: string[],
  filters: {
    [key: string]: string[]
  }[]
) => {
  // If filterNames is empty, load and extract filter names from the filter data
  if (filterNames.length === 0) {
    const filterData = await loadJson(category)
    filterNames = filterData.map(
      filter => (filter.category || filter?.subCategory) as string
    )
  }

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
  const { query, page, filterData = [] } = filter || {}

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
  const awaitingFiltersFromStore = useMemo(
    () =>
      sortFilters(
        category,
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
  const awaitingFiltersFromUrl = useMemo(() => {
    const temp = Array.from(searchParams.entries())
      // Filter out the search params that are not related to filters
      .filter(([key]) => {
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
      >((acc, [key, value]) => {
        key = decodeURI(key)

        return [
          ...acc,
          {
            [key]:
              value
                ?.split(',')
                ?.map(e => decodeURI(e))
                ?.filter(e => e.length !== 0) || []
          }
        ]
      }, [])

    // Input: filterB=B_AMD,A_AMD&filterA=AMD,인텔
    // Output: [{filterA: ['AMD', '인텔']}, {filterB: ['A_AMD', 'B_AMD']}]
    return sortFilters(category, filterNames, temp)
  }, [searchParams, selectedFilters])

  // If the user changes the search params through url, then the browser
  // will be reloaded. (Meaning, the result from this hook will be true as well).
  // And we take that as the user wants to change the filters. So we do not bring selected filters
  // from the store. We just use the filters from the url.
  const isDirectAccess = useIsDirectAccess()

  useEffect(
    () => {
      async function init() {
        // Await for the filters from the url and the store to be ready
        // in case they are not ready yet because of the filter data not being loaded yet
        const filtersFromUrl = await awaitingFiltersFromUrl
        const filtersFromStore = await awaitingFiltersFromStore

        const isEqual =
          // Since they are both trimmed and sorted, we can compare them by stringifying them.
          JSON.stringify(filtersFromUrl) === JSON.stringify(filtersFromStore) &&
          page === (Number(searchParams.get('page')) || undefined) &&
          query === (searchParams.get('query') || undefined)

        // @Important:
        // Compare parsed filters from url and the selected filters in the redux store.
        // Only attempt to change the search params if they are not same.
        // Or else, it will cause infinite loop

        // Rendering scenario:
        // with this condition check
        // 1st render: Filter state changes
        // 2nd render: Search params changes
        // 3rd render: will stop here because the search params are the same as the filter state

        // without this condition check
        // 1st render: Filter state changes
        // 2nd render: Search params changes
        // 3rd render: Search params changes again because it's the new reference
        // 4th render: Search params changes again because it's the new reference
        // ...
        if (isEqual) {
          return
        }

        // If we are the one who's changing the search params by dispatching the actions
        if (!isDirectAccess) {
          const newSearchParams = filtersFromStore.reduce<{
            [key: string]: string
          }>((acc, filter) => {
            const key = Object.keys(filter)[0]

            // Replace the spaces with %20
            const encodedKey = Object.keys(filter)[0].replace(/\s/g, '%20')
            // Replace the spaces with %20
            // and join the options with comma
            const value = filter[key]
              .map(e => e.replace(/\s/g, '%20'))
              .join(',')
            return {
              ...acc,
              // Use encoded key and value
              [encodedKey]: value
            }
          }, {})

          // Set new search params
          setSearchParams(newSearchParams, {
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
      }

      init()
    },
    // Every time the filters change, update the search params
    // We need searchParams and setSearchParams because every time we set new search params,
    // the reference will be changed. So we need to update the reference as well.
    [selectedFilters, searchParams, setSearchParams]
  )
}
