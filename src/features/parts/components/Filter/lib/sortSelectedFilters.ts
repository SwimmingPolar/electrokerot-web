import { FilterDataType, SelectedFiltersType } from 'features'

const indexOf = (value: string, array: string[]) =>
  array.findIndex(arrayValue => arrayValue === value)

// Sort the given array of filters
// in the order of the original array
export const sortSelectedFilters = (
  originalFilters: FilterDataType[],
  selectedFilters: SelectedFiltersType[]
) => {
  if (!originalFilters || originalFilters?.length === 0) {
    return selectedFilters
  }

  // Create an array with a length of the selected filters
  let sorted = Array.from({
    length: selectedFilters?.length || 0
  }) as SelectedFiltersType[]

  // Extract filter names from the original filters
  const filterNames = (originalFilters?.map(
    ({ category, subCategory }) => category || subCategory
  ) || []) as string[]

  sorted.forEach((_, index) => {
    // Sort the category/sub-category first (ex, 쓰레드수, 코어수, ...)
    const originalPosition = indexOf(
      selectedFilters[index].filterName,
      filterNames
    )
    sorted[originalPosition] = { ...selectedFilters[index] }

    // Sort the values (ex, 8코어, 4코어, ...)
    // Iterate over the sorted array
    const sortedValues = [] as string[]
    sorted[originalPosition].filterOptions.forEach(value => {
      // Place to store sorted values array
      const originalValues =
        originalFilters[
          filterNames.findIndex(
            filterName => filterName === selectedFilters[index].filterName
          )
        ].values
      const originalValuePosition = indexOf(value, originalValues)

      sortedValues[originalValuePosition] = value
    })

    // Save the sorted values with undefined values removed
    sorted[originalPosition].filterOptions = sortedValues.filter(Boolean)
  })

  // Remove undefined
  sorted = sorted.filter(Boolean)

  return sorted
}
