import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import {
  FilterDataType,
  selectFilters,
  setFilterOptions,
  setQuery
} from 'features'
import { useIsDirectAccess } from 'hooks'
import { useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const pruneSearchParams = (
  searchParams: URLSearchParams,
  filterData: FilterDataType[]
) => {
  // This will return pruned search params object
  // e.g. { [key in string]: string }
  // value will be a comma separated string

  // Iterate over each search params with [key, value] format
  return Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
    // In case of known keys, handle them separately
    if (key === 'query' || key === 'page') {
      return acc
    }

    try {
      // Decode key
      const decodedKey = decodeURI(key)
      // Take the filterName and check if it is in the filterData
      const filterName = filterData.find(filter => {
        return (
          filter.category === decodedKey || filter.subCategory === decodedKey
        )
      })

      // If it is not in the filterData, remove it from the search params
      if (!filterName) {
        return acc
      }

      // Decode values
      const decodedValues = value.split(',').map(decodeURI)
      // Take the decoded values and check if they are in the filterData
      const filterOptions =
        filterData.find(filter => {
          return (
            filter.category === decodedKey || filter.subCategory === decodedKey
          )
        })?.values || []

      // Take each decodedValues and check if it is in the filterData
      const newValues = decodedValues.filter(decodedValue => {
        // Remove !! from the decodedValue
        decodedValue = decodedValue.replace(/^!!/g, '')
        const isValid =
          filterOptions.includes(decodedValue) ||
          filterOptions.includes('!!' + decodedValue)

        // If it is not in the filterData, remove it from the search params
        if (isValid) {
          return true
        } else {
          return false
        }
      })

      const encodedValue = newValues.map(e => e.replace(/\s/g, '%20')).join(',')

      return {
        ...acc,
        [key]: encodedValue
      }
    } catch (error) {
      // If any error while decoding key and values
      // remove from the search params
      searchParams.delete(key)
      return acc
    }
  }, {} as { [key in string]: string })
}

// This has to be a async function because we need to wait for
// the filter data if it is not loaded yet.
const sortFilters = (
  category: PartsCategoriesType,
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

  const filter = useSelector(state => selectFilters(state)[category])

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
  const filtersFromStore = useMemo(
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
  const filtersFromUrl = useMemo(() => {
    // const temp = Array.from(searchParams.entries())
    const prunedSearchParams = pruneSearchParams(searchParams, filterData)
    const temp = Object.entries(prunedSearchParams)
      // Filter out the search params that are not related to filters
      .filter(([key]) => {
        if (['query', 'page'].includes(key)) {
          return false
        }
        return true
      })
      // Remove malformed search params
      .filter(([key, value]) => {
        try {
          decodeURI(key)
          value?.split(',').forEach(e => decodeURI(e))
          return true
        } catch (error) {
          return false
        }
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
  }, [selectedFilters])

  // If the user changes the search params through url, then the browser
  // will be reloaded. (Meaning, the result from this hook will be true as well).
  // And we take that as the user wants to change the filters. So we do not bring selected filters
  // from the store. We just use the filters from the url.
  const isDirectAccess = useIsDirectAccess()

  useEffect(
    () => {
      console.log('useChangeSearchParams')
      const isEqual =
        //   // Since they are both trimmed and sorted, we can compare them by stringifying them.
        JSON.stringify(filtersFromUrl) === JSON.stringify(filtersFromStore) &&
        page === (searchParams.get('page') || undefined) &&
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
          const value = filter[key].map(e => e.replace(/\s/g, '%20')).join(',')
          return {
            ...acc,
            // Use encoded key and value
            [encodedKey]: value
          }
        }, {})

        // Set the query and page in the search params
        if (query) {
          newSearchParams.query = query
        } else if (page) {
          newSearchParams.page = page.toString()
        }

        // @Issue: This may impose problems.
        // We are deferring the search params change because we want to make sure
        // setting the new search param which is also same as using navigate
        // happens only after the popup is closed.
        setTimeout(() => {
          // Set new search params
          setSearchParams(newSearchParams, {
            replace: true
          })
        }, 0)
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

        // If there's new query, then set it.
        // New query means, the value in the store is different
        // from the value in the search params because the user
        // might have changed it. And we respect the user's input.
        const queryParam = searchParams.get('query')
        const newQuery = queryParam && queryParam.length !== 0 ? queryParam : ''

        // @Todo: description
        setTimeout(() => {
          dispatch(
            setQuery({
              category,
              query: newQuery
            })
          )

          dispatch(
            setFilterOptions({ category, filterOptions: newSelectedFilters })
          )
        })
      }
    },
    // Every time the filters change, update the search params
    // We need searchParams and setSearchParams because every time we set new search params,
    // the reference will be changed. So we need to update the reference as well.
    [
      query,
      page,
      selectedFilters
      // prunedSearchParams
      // searchParams,
      // setSearchParams
    ]
  )
}
