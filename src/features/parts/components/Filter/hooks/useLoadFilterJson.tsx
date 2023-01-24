import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { FilterDataType, selectFilters, setFilters } from 'features'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

type UseLoadFilterJsonType = {
  category?: PartsCategoriesType
}

const loadJson = async (category: PartsCategoriesType) => {
  const filterData = (await import(`../files/${category}.json`))[
    'default'
  ] as FilterDataType[]

  return filterData
}

export const useLoadFilterJson = (props?: UseLoadFilterJsonType) => {
  const { category: categoryParam } = useParams() as {
    category: PartsCategoriesType
  }
  const category = props?.category || categoryParam
  const dispatch = useDispatch()
  const filterData =
    useSelector(state => selectFilters(state)[category]?.filterData) || []

  useEffect(() => {
    // Filter json file loader
    const getFilters = async () => {
      const filterData = await loadJson(category)

      // Save loaded filters to redux store
      dispatch(
        setFilters({
          category: category as PartsCategoriesType,
          filterData
        })
      )
    }

    if (filterData.length === 0) {
      getFilters()
    }
  }, [category])
}

// export const useLoadFilterJson = (props?: UseLoadFilterJsonType) => {
//   const { category: categoryParam } = useParams() as {
//     category: PartsCategoriesType
//   }
//   const category = props?.category || categoryParam
//   const dispatch = useDispatch()
//   const filterData = useSelector(selectFilters)[category]?.['filterData'] || []

//   useEffect(() => {
//     let data: FilterDataType[] = []
//     // @Important: Throwing promise to be caught by React Suspense
//     // should be synchronous. Otherwise, React Suspense will not work.
//     // In a nutshell, thrown promise will be caught inside another call stack
//     // that is not part of the current call stack.
//     if (filterData.length === 0) {
//       // PromiseGuard will throw promise if it is not resolved yet.
//       // This enables us to make use of React Suspense
//       data = promiseGuard(
//         `useLoadFilterJson-${category}`,
//         loadJson(category)
//       ) as FilterDataType[]

//       dispatch(
//         setFilters({
//           category: category as PartsCategoriesType,
//           filterData: data
//         })
//       )
//     }
//   }, [category, filterData])

//   return filterData
// }
