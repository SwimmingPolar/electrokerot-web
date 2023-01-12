import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { FilterValuesType, selectFilters, setFilters } from 'features'
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
  const filters = useSelector(selectFilters)[category] || []

  useEffect(() => {
    // Filter json file loader
    const getFilters = async () => {
      const filters = (await import(`../files/${category}.json`))[
        'default'
      ] as FilterValuesType[]

      // Save loaded filters to redux store
      dispatch(
        setFilters({
          category: category as PartsCategoriesType,
          filters
        })
      )
    }

    if (filters.length === 0) {
      getFilters()
    }
  }, [category, categoryParam, props])
}
