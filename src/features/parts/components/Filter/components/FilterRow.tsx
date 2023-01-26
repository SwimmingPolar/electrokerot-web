import { FormGroup } from '@mui/material'
import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType, RowCount } from 'constant'
import {
  selectFilters,
  setBackupFilterOptionValues,
  setFilterOptions,
  toggleFilterOptions,
  toggleSubFilter
} from 'features'
import { useDeviceDetect } from 'hooks'
import React, { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { media } from 'styles'
import { MemoizedOptionCheckbox as OptionCheckbox } from './OptionCheckbox'

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
    height: fit-content;

    :hover {
      text-decoration: underline;
    }
  }

  span {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: 900;
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

type FilterRowType = {
  category: PartsCategoriesType
  filterName: string
}

export const FilterRow = ({ category, filterName }: FilterRowType) => {
  // Extract row data from redux store by filter name
  const filterRowData = useSelector(state =>
    selectFilters(state)?.[category]?.filterData?.find(
      filter =>
        filter.category === filterName || filter.subCategory === filterName
    )
  )
  const selectedFilters = useSelector(state =>
    selectFilters(state)?.[category]?.selectedFilters?.find(
      filter => filter.filterName === filterName
    )
  )
  const backupSelectedFilters = useSelector(state =>
    selectFilters(state)?.[category]?.backupSelectedFilters?.find(
      filter => filter.filterName === filterName
    )
  )
  const isSubFilterOpen = useSelector(
    state =>
      selectFilters(state)?.[category]?.filterState?.subFilters?.[filterName]
  )

  const { matchingType: filterMatchingType, values: filterValues = [] } =
    filterRowData || {}

  // Extract selected values and its backups
  const selectedValues = useMemo(
    () => selectedFilters?.filterOptions || [],
    [selectedFilters]
  )
  const backupSelectedValues = useMemo(
    () => backupSelectedFilters?.filterOptions || [],
    [backupSelectedFilters]
  )

  const handleFilterNameClick = useCallback(() => {
    const isAllSelected =
      // To know if all the options are selected, check if the length
      // of the selected values is the same as the length of the values
      selectedValues.length === filterValues.length &&
      // And make sure none of the values are minus filters.
      selectedValues.every(value => !/^!!.+/.test(value))

    const isAllMinusSelected =
      selectedValues.length === filterValues.length &&
      selectedValues.every(value => /^!!.+/.test(value))

    const isNotSelectedAtAll = selectedValues.length === 0

    let newSelectedValues: string[]
    // If all are selected, turn into all minus selected
    if (isAllSelected) {
      newSelectedValues = filterValues.map(value => '!!' + value)
    }
    // If all are minus selections, unselect all
    else if (isAllMinusSelected) {
      newSelectedValues = []
    }
    // If no options are selected, restore from backup
    else if (isNotSelectedAtAll) {
      newSelectedValues =
        backupSelectedValues.length === 0 ? filterValues : backupSelectedValues
    }
    // If options are sparsely selected, select all
    // And save currently selected values to backup in the store.
    else {
      newSelectedValues = filterValues
      dispatch(
        setBackupFilterOptionValues({
          category,
          filterName,
          filterOptions: selectedValues
        })
      )
    }

    // Set the new selected values
    dispatch(
      setFilterOptions({
        category,
        filterOptions: [
          {
            filterName,
            filterOptions: newSelectedValues
          }
        ]
      })
    )
  }, [category, selectedValues, backupSelectedValues])

  // Get the current device type
  const { device } = useDeviceDetect()
  // Default count of rows to show
  const rowCount = RowCount[device as keyof typeof RowCount]
  const optionsList = useMemo(
    () => (!isSubFilterOpen ? filterValues.slice(0, rowCount) : filterValues),
    [isSubFilterOpen, filterValues, rowCount]
  )

  // Handle checkbox change
  const dispatch = useDispatch()
  const handleOptionChange = useCallback(
    (value: string) => {
      dispatch(
        toggleFilterOptions({
          category: category,
          filterName,
          filterOption: value
        })
      )
    },
    [category, filterName]
  )

  // Disable the handler if the target filter has matchingType of 'min' or 'max'
  // because it can only select one value
  const disableSelectAll =
    filterMatchingType === 'min' || filterMatchingType === 'max'

  const OptionCheckboxList = useMemo(
    () =>
      optionsList.map((value, index) => {
        const checked = selectedValues.includes(value)
        const minusChecked = selectedValues.includes('!!' + value)
        const checkType = checked
          ? 'checked'
          : minusChecked
          ? 'minus'
          : 'unchecked'

        return (
          <OptionCheckbox
            key={index}
            value={value}
            checkType={checkType}
            handleOptionChange={handleOptionChange}
          />
        )
      }),
    [selectedValues, optionsList]
  )

  return (
    <FilterRowBox>
      {/* Filter Name */}
      <FilterNameBox>
        <button onClick={!disableSelectAll ? handleFilterNameClick : undefined}>
          <span>{filterName}</span>
        </button>
      </FilterNameBox>
      {/* Filter Options */}
      <FormGroup className="filter-options">{OptionCheckboxList}</FormGroup>
      <ShowMore
        filterName={filterName}
        optionsLength={filterValues.length}
        rowCount={rowCount}
        isOpen={!!isSubFilterOpen}
      />
    </FilterRowBox>
  )
}

export const MemoizedFilterRow = React.memo(FilterRow)
