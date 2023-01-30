import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { FilterDataType, SelectedFiltersType } from 'features'
import { useMemo } from 'react'
import styled from 'styled-components'

const SelectedFilterBox = styled.div`
  display: flex;
  flex-direction: column;

  &.filter-item {
    margin-bottom: -24px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  .filter-name {
    z-index: 2;
  }
  .filter-options {
    z-index: 1;
  }
  button:focus-visible {
    outline: 2px solid black;
  }
`

const SelectedFilterNameBox = styled.div<{ targetFilter: string | undefined }>`
  display: flex;
  margin-top: ${({ targetFilter }) => (targetFilter ? '0' : '54px')};

  button {
    cursor: pointer;
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;

    .icon {
      font-size: 22px;
      color: ${({ theme }) => theme.colors.gray300};
      transition: 0.2s color ease-in-out;
    }

    &:hover {
      h3 {
        text-decoration: underline;
      }
      .icon {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
  h3 {
    display: inline-flex;
    font-size: 18px;
    font-weight: 800;
    font-family: ${({ theme }) => theme.fonts.secondary};
    color: ${({ theme }) => theme.colors.primary};
    padding: 15px 2px 15px 10px;
  }
`

const SelectedFilterOptionsBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 9px;
  button {
    display: flex;
    flex-shrink: 1;
    justify-content: center;
    align-items: center;
    padding: 10px 12px;
    background-color: ${({ theme }) => theme.colors.gray200};
    cursor: pointer;

    :hover {
      background-color: ${({ theme }) => theme.colors.blue100};
      text-decoration: underline;
    }
    :hover.selected {
      text-decoration: none;
    }

    span {
      font-size: 14px;
      font-family: ${({ theme }) => theme.fonts.primary};
    }
  }
  button.selected {
    background-color: ${({ theme }) => theme.colors.blue300};

    span {
      color: ${({ theme }) => theme.colors.white};
    }
  }
  button.selected.minus {
    background-color: ${({ theme }) => theme.colors.red};

    span {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`

type SelectedFiltersSectionType = {
  targetFilter: string | undefined
  filterData: FilterDataType[]
  filterName: string
  filterOptions: string[]
  selectedFilters: SelectedFiltersType[]
  handleFilterOptionClick: (
    filterName: string,
    filterOption: string
  ) => () => void
  handleFilterNameClick: (filterName: string) => void
}

export const SelectedFilter = ({
  targetFilter,
  filterData,
  filterName,
  filterOptions,
  selectedFilters,
  handleFilterOptionClick,
  handleFilterNameClick
}: SelectedFiltersSectionType) => {
  const filterOptionConfig = filterData?.find(
    filter =>
      filter?.category === filterName || filter?.subCategory === filterName
  )
  const disableSelectAll = useMemo(
    () =>
      filterOptionConfig?.matchingType === 'max' ||
      filterOptionConfig?.matchingType === 'min',
    [filterData, filterOptionConfig]
  )

  // Extract the selected options' state (selected, selected minus, or unselected)
  const selectedFilter = selectedFilters?.find(
    selectedFilter => selectedFilter.filterName === filterName
  )
  const getFilterState = (option: string) => {
    const isChecked = selectedFilter?.filterOptions.includes(option)
    const isMinusChecked = selectedFilter?.filterOptions.includes(`!!${option}`)

    if (isChecked) {
      return 'selected'
    } else if (isMinusChecked) {
      return 'selected minus'
    } else {
      return ''
    }
  }

  return (
    <SelectedFilterBox className="filter-item">
      <SelectedFilterNameBox
        id={filterName}
        targetFilter={targetFilter}
        className="filter-name"
      >
        <button
          onClick={() => !disableSelectAll && handleFilterNameClick(filterName)}
          tabIndex={0}
        >
          <h3>{filterName}</h3>
          {!disableSelectAll && <RestartAltIcon className="icon reset" />}
        </button>
      </SelectedFilterNameBox>
      <SelectedFilterOptionsBox className="filter-options">
        {filterOptions.map((option, index) => (
          <button
            key={index}
            className={getFilterState(option)}
            onClick={handleFilterOptionClick(filterName, option)}
            tabIndex={0}
          >
            <span>{option}</span>
          </button>
        ))}
      </SelectedFilterOptionsBox>
    </SelectedFilterBox>
  )
}
