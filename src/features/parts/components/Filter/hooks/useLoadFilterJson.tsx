import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { FilterDataType, selectFilters, setFilters } from 'features'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

type UseLoadFilterJsonType = {
  category?: PartsCategoriesType
}

export const useLoadFilterJson = (props?: UseLoadFilterJsonType) => {
  const { category: categoryParam } = useParams() as {
    category: PartsCategoriesType
  }
  const category = props?.category || categoryParam
  const dispatch = useDispatch()
  const filterData = useSelector(selectFilters)[category]?.['filterData'] || []

  useEffect(() => {
    // Filter json file loader
    const getFilters = async () => {
      const filterData = (await import(`../files/${category}.json`))[
        'default'
      ] as FilterDataType[]

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
