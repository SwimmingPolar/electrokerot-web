import { FormGroup } from '@mui/material'
import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType, RowCount } from 'constant'
import {
  FilterValuesType,
  selectFiltersState,
  selectSelectedFilters,
  setBackupFilterOptionValues,
  setFilterOptions,
  toggleFilterOptions,
  toggleSubFilter
} from 'features'
import { useDeviceDetect } from 'hooks'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { media } from 'styles'
import { OptionCheckbox } from './OptionCheckbox'

const FilterRowBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  /* Filter Options */
  .filter-options {
    flex: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    /* Label wrapper */
    .label-box {
      display: flex;
      flex-direction: row;
      height: 24px;
      /* default row count: 5 */
      width: calc(100% / ${RowCount.desktopLarge});
      /* 4 rows on desktopSmall and tablet */
      ${media.desktopSmall`
        width: calc(100% / ${RowCount.desktopSmall});
      `}
      ${media.tablet`
        width: calc(100% / ${RowCount.tablet});
      `}
      background-color: ${({ theme }) => theme.colors.white};
    }

    /* Label */
    span.MuiFormControlLabel-label {
      font-size: 13px;
      font-family: ${({ theme }) => theme.fonts.primary};
      color: ${({ theme }) => theme.colors.primary400};
      transition: 0.3s color ease-in-out;

      :hover {
        text-decoration: underline;
        color: ${({ theme }) => theme.colors.primary};
      }
    }
    .label-box.checked {
      span.MuiFormControlLabel-label {
        font-weight: bold;
      }
    }

    /* Checkbox */
    .MuiCheckbox-root {
      padding: 4px;
      background-color: ${({ theme }) => theme.colors.white};
    }

    /* To make the label smaller, let the padding take up all the space */
    .padding {
      flex: 1;
    }
  }

  .show-more {
    display: flex;
    justify-content: space-between;
    align-self: center;
    width: 42px;
    background-color: ${({ theme }) => theme.colors.white};
    cursor: pointer;

    span {
      font-size: 11px;
      border-bottom: 1px solid black;
      height: 15px;
    }
  }

  .show-more-padding {
    width: 42px;
  }
`

const FilterNameBox = styled.div`
  display: flex;
  width: 135px;
  flex-direction: row;

  button {
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }

  span {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-weight: 800;
    height: 24px;
    color: ${({ theme }) => theme.colors.primary};
  }
`

const ShowMore = ({
  filterName,
  optionsLength,
  rowCount,
  isOpen
}: {
  filterName: string
  optionsLength: number
  rowCount: number
  isOpen: boolean
}) => {
  const dispatch = useDispatch()
  const { category } = useParams() as { category: PartsCategoriesType }

  // Decide whether to show the show more button
  const showMore = optionsLength > rowCount
  // Show how many more options are available
  const howManyMore = optionsLength - rowCount

  const handleClick = useCallback(() => {
    dispatch(toggleSubFilter({ category, subFilter: filterName }))
  }, [filterName, category])

  return showMore ? (
    <button className="show-more" onClick={showMore ? handleClick : undefined}>
      {isOpen ? <span>{'닫기'}</span> : <span>{'+' + howManyMore + '개'}</span>}
    </button>
  ) : (
    <div className="show-more-padding" />
  )
}

export const FilterRow = ({
  category,
  subCategory,
  values
}: FilterValuesType) => {
  const { device } = useDeviceDetect()
  // Name of the current filter
  const filterName = (category || subCategory) as string

  // Decide if the sub filter is open or not
  const { category: partCategory } = useParams() as {
    category: PartsCategoriesType
  }

  const selectedFilters =
    useSelector(selectSelectedFilters)?.[partCategory] || []

  // Get currently selected values
  const selectedValues =
    selectedFilters.find(
      selectedFilter => selectedFilter.filterName === filterName
    )?.filterOptions || []

  const isSubFilterOpen = useSelector(selectFiltersState)?.[partCategory]
    ?.subFilters?.[filterName] as boolean

  // Get backup selected filter values
  const backupSelectedFilterValues =
    useSelector(selectSelectedFilters).backup?.[partCategory]?.find(
      filter => filter.filterName === filterName
    )?.filterOptions || []

  const handleFilterNameClick = useCallback(() => {
    const isAllSelected =
      // To know if all the options are selected, check if the length
      // of the selected values is the same as the length of the values
      selectedValues.length === values.length &&
      // And make sure none of the values are minus filters.
      selectedValues.every(value => !/^!!.+/.test(value))

    const isAllMinusSelected =
      selectedValues.length === values.length &&
      selectedValues.every(value => /^!!.+/.test(value))

    const isNotSelectedAtAll = selectedValues.length === 0

    let newSelectedValues: string[]
    // If all are selected, turn into all minus selected
    if (isAllSelected) {
      newSelectedValues = values.map(value => '!!' + value)
    }
    // If all are minus selections, unselect all
    else if (isAllMinusSelected) {
      newSelectedValues = []
    }
    // If no options are selected, restore from backup
    else if (isNotSelectedAtAll) {
      newSelectedValues =
        backupSelectedFilterValues.length === 0
          ? values
          : backupSelectedFilterValues
    }
    // If options are sparsely selected, select all
    // And save currently selected values to backup in the store.
    else {
      newSelectedValues = values
      dispatch(
        setBackupFilterOptionValues({
          category: partCategory,
          filterName,
          filterOptions: selectedValues
        })
      )
    }

    const filterIndex = selectedFilters.findIndex(
      filter => filter.filterName === filterName
    )
    // Clone the selected filters to avoid mutating the state
    const clonedSelectedFilters = structuredClone(selectedFilters)
    if (filterIndex !== -1) {
      clonedSelectedFilters.splice(filterIndex, 1)
    }

    // Set the new selected values
    dispatch(
      setFilterOptions({
        category: partCategory,
        filterOptions: [
          ...clonedSelectedFilters,
          {
            filterName,
            filterOptions: newSelectedValues
          }
        ]
      })
    )
  }, [
    selectedFilters,
    selectedValues,
    values,
    filterName,
    partCategory,
    backupSelectedFilterValues
  ])

  // Default count of rows to show
  const rowCount = RowCount[device as keyof typeof RowCount]
  const optionsList = !isSubFilterOpen ? values.slice(0, rowCount) : values

  // Handle checkbox change
  const dispatch = useDispatch()
  const handleOptionChange = useCallback(
    (value: string) => {
      dispatch(
        toggleFilterOptions({
          category: partCategory,
          filterOptions: {
            filterName,
            filterOptions: [value]
          }
        })
      )
    },
    [filterName, partCategory]
  )

  return (
    <FilterRowBox>
      {/* Filter Name */}
      <FilterNameBox>
        <button onClick={handleFilterNameClick}>
          <span>{filterName}</span>
        </button>
      </FilterNameBox>

      {/* Filter Options */}
      <FormGroup className="filter-options">
        {optionsList.map((value, index) => (
          <OptionCheckbox
            key={index}
            selectedValues={selectedValues}
            value={value}
            handleOptionChange={handleOptionChange}
          />
        ))}
      </FormGroup>
      <ShowMore
        filterName={filterName}
        optionsLength={values.length}
        rowCount={rowCount}
        isOpen={isSubFilterOpen}
      />
    </FilterRowBox>
  )
}
