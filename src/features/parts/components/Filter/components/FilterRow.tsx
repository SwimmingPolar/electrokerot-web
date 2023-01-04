import { FormGroup } from '@mui/material'
import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType, RowCount } from 'constant'
import {
  FilterValuesType,
  selectFiltersState,
  selectSelectedFilters,
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

  /* Filter Name */
  .filter-name {
    width: 135px;
    font-size: 14px;
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-weight: 800;
    height: 24px;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.primary};
  }

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
      /* default row count: 5 */
      width: calc(100% / ${RowCount.desktopLarge});
      /* 4 rows on desktopSmall and tablet */
      ${media.desktopSmall`
        width: calc(100% / ${RowCount.desktopSmall});
      `}
      ${media.tablet`
        width: calc(100% / ${RowCount.tablet});
      `}
      height: 24px;
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
  const isSubFilterOpen = useSelector(selectFiltersState)?.[partCategory]
    ?.subFilters?.[filterName] as boolean

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

  const selectedValues =
    useSelector(selectSelectedFilters)?.[partCategory]?.find(
      selectedFilter => selectedFilter.filterName === filterName
    )?.filterOptions || []

  return (
    <FilterRowBox>
      {/* Filter Name */}
      <span className="filter-name">{filterName}</span>

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
