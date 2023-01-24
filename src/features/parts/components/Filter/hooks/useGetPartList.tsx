import { useGetPartsQuery, useSearchOptions } from 'features'

export const useGetPartList = () => {
  const searchOptions = useSearchOptions()
  useGetPartsQuery(searchOptions)
}
