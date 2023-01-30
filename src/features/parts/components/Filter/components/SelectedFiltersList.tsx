import {
  FilterType,
  SelectedFiltersType,
  ToggleChangeFiltersPopupType
} from 'features'
import { useMemo } from 'react'
import styled from 'styled-components'
import { media } from 'styles'
import { useAreFiltersOverflow } from '../hooks/useAreFiltersOverflow'
import { useIsScrollAtEnd } from '../hooks/useIsScrollAtEnd'
import { useMoveScroll } from '../hooks/useMoveScroll'
import { sortSelectedFilters } from '../lib'
import { GradientShadow } from './GradientShadow'

export const SelectedFilterItemsBoxClassName = 'selected-filter-items-box'

const SelectedFiltersListBox = styled.div`
  flex: 1;
  display: flex;
  width: 0;
  overflow: hidden;
  position: relative;
  /* @Issue: When transition is added, there's flickering due to box-shadow being updated */

  button:focus-visible {
    outline: none !important;
    background-color: ${({ theme }) => theme.colors.primary200};
  }
`

const SelectedFilterItemsBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 9px;
  overflow-x: scroll;
  overflow-y: hidden;
  overscroll-behavior: contain;

  ::-webkit-scrollbar {
    display: none;
  }

  .filter-item {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    border-radius: 3px;
    transition: border 0.2s ease-in-out;
    display: flex;
    box-shadow: rgba(9, 30, 66, 0.15) 0px 1px 1px,
      rgba(9, 30, 66, 0.075) 0px 0px 1px 1px;
    font-size: 13px;
    font-family: ${({ theme }) => theme.fonts.secondary};
    color: ${({ theme }) => theme.colors.primary};
    padding: 12px;

    :hover {
      border: 1px solid ${({ theme }) => theme.colors.primary};
      box-shadow: rgba(9, 30, 66, 0.3) 0px 1px 1px,
        rgba(9, 30, 66, 0.125) 0px 0px 1px 1px;
    }

    ${media.device('foldable', 'mobile')`
      font-size: 14px;
      padding: 10px;
    `}
  }

  .filter-name {
  }

  .filter-values {
    display: flex;
    flex-direction: row;
  }

  .filter-content {
    white-space: pre;
  }
`

const SelectedFilterItem = ({
  filterName,
  values,
  toggleChangeFiltersPopup
}: {
  filterName: string
  values: string[]
  toggleChangeFiltersPopup: ToggleChangeFiltersPopupType
}) => {
  if (values.length <= 0) {
    return null
  }

  return (
    <button
      className="filter-item"
      // Toggle change filters popup for specific filter name
      onClick={toggleChangeFiltersPopup(true)(filterName) as () => void}
      tabIndex={0}
    >
      <div className="filter-name">
        <span className="filter-content">{filterName + ':  '}</span>
      </div>
      <div className="filter-values">
        {values.map((value, index) => (
          <span key={index} className="filter-content">
            {value}
            {values.length - 1 === index ? '' : ', '}
          </span>
        ))}
      </div>
    </button>
  )
}

type SelectedFiltersListType = {
  filter: FilterType
  selectedFilters: SelectedFiltersType[]
  toggleChangeFiltersPopupType: ToggleChangeFiltersPopupType
}

export const SelectedFiltersList = ({
  filter,
  selectedFilters,
  toggleChangeFiltersPopupType
}: SelectedFiltersListType) => {
  // Sort the selected filters by the order of the filters
  const sortedFilters = useMemo(
    () => sortSelectedFilters(filter.filterData, selectedFilters),
    [filter, selectedFilters]
  )

  // Show the shadow if the filters overflow
  const hasOverflow = useAreFiltersOverflow(selectedFilters)
  // Show the shadow if the scroll is not at the end
  const { isScrollAtStart, isScrollAtEnd, handleScroll } = useIsScrollAtEnd({
    selectedFilters,
    containerSelector: SelectedFilterItemsBoxClassName
  })
  // Enable scrolling on the list
  useMoveScroll(SelectedFilterItemsBoxClassName)

  // Shadows for both edges of the list
  const StyledGradientShadow = ({
    direction
  }: {
    direction: 'left' | 'right'
  }) => (
    <GradientShadow
      hasOverflow={hasOverflow}
      isScrollAtEnd={isScrollAtEnd}
      isScrollAtStart={isScrollAtStart}
      direction={direction}
    />
  )

  return (
    <SelectedFiltersListBox className="selected-filters-list-box">
      <>
        <StyledGradientShadow direction="left" />
        <SelectedFilterItemsBox
          onScroll={handleScroll}
          className={SelectedFilterItemsBoxClassName}
        >
          {sortedFilters.map(({ filterName, filterOptions }, index) => (
            <SelectedFilterItem
              key={index}
              filterName={filterName}
              values={filterOptions}
              toggleChangeFiltersPopup={toggleChangeFiltersPopupType}
            />
          ))}
        </SelectedFilterItemsBox>
        <StyledGradientShadow direction="right" />
      </>
    </SelectedFiltersListBox>
  )
}
