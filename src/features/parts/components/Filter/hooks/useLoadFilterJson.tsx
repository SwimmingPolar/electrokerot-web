import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { FilterDataType, selectFilters, setFilters } from 'features'
import { promiseGuard } from 'lib'
import { useParams } from 'react-router-dom'

type UseLoadFilterJsonType = {
  category?: PartsCategoriesType
}

const asyncSleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const loadJson = async (category: PartsCategoriesType) => {
  const filterData = (await import(`../files/${category}.json`))[
    'default'
  ] as FilterDataType[]

  await asyncSleep(3000)

  return filterData
}

export const useLoadFilterJson = (props?: UseLoadFilterJsonType) => {
  const { category: categoryParam } = useParams() as {
    category: PartsCategoriesType
  }
  const category = props?.category || categoryParam
  const dispatch = useDispatch()
  const filterData = useSelector(selectFilters)[category]?.['filterData'] || []

  if (filterData.length === 0) {
    // PromiseGuard will throw promise if it is not resolved yet.
    // This enables us to make use of React Suspense
    const data = promiseGuard(
      `useLoadFilterJson-${category}`,
      loadJson(category)
    ) as FilterDataType[]

    dispatch(
      setFilters({
        category: category as PartsCategoriesType,
        filterData: data
      })
    )
  }

  return filterData
}
