import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import {
  selectFilters,
  selectFiltersState,
  ToggleChangeFiltersPopupType,
  toggleFilter
} from 'features'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { media } from 'styles'
import { SelectedFiltersList } from './SelectedFiltersList'

const Box = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 800;
  height: 39px;
  gap: 20px;

  button {
    cursor: pointer;
  }
`

const FilterButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 135px;
  border: 1px solid transparent;
  transition: 0.2s ease-in-out;

  &.show-more:hover {
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    background-color: ${({ theme }) => theme.colors.gray100};

    span {
      color: ${({ theme }) => theme.colors.primary};
    }
    .icon.arrow {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  &:not(.show-more) {
    button {
      cursor: auto;
    }
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
    width: 100%;
    padding: 7px 2px;
  }

  .icon.filter {
    font-size: 28px;
    color: ${({ theme }) => theme.colors.blue300};
  }
  span {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.primary400};
  }
  .icon.arrow {
    font-size: 22px;
    color: ${({ theme }) => theme.colors.gray400};
    margin-left: 15px;
    transition: color 0.2s ease-in-out;
  }
  &:not(.show-more) .icon.arrow {
    visibility: hidden;
    transition: none;
  }
  .icon.arrow.close {
    transform: rotate(180deg);
  }

  ${media.device('foldable', 'mobile')`
    display: none;
  `}
`

const ChangeSelectedFiltersBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 135px;
  border-radius: 5px;
  border: 1px solid transparent;
  transition: 0.2s ease-in-out;

  :hover {
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    background-color: ${({ theme }) => theme.colors.gray100};

    span {
      color: ${({ theme }) => theme.colors.primary};
    }
    .icon.layer {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 100%;
    padding: 7px 2px;
  }

  .icon.layer {
    font-size: 28px;
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.primary400};
    transition: 0.2s ease-in-out;
  }
  span {
    font-size: 22px;
    color: ${({ theme }) => theme.colors.primary400};
  }

  ${media.device('foldable', 'mobile')`
    display: none;
  `}
`

type UpperBoxType = {
  toggleChangeFiltersPopup: ToggleChangeFiltersPopupType
}

export const UpperBox = ({ toggleChangeFiltersPopup }: UpperBoxType) => {
  const dispatch = useDispatch()
  const { category } = useParams() as { category: PartsCategoriesType }

  // Get filters list for the category
  const filters = useSelector(selectFilters)?.[category]

  // Decides whether the filter is open or not
  const isFilterOpen = useSelector(selectFiltersState)[category]?.open

  // Check if there are more than 5 filters
  const showMore = filters && filters.length > 5

  // Show or hide filters on click
  const handleFilterButtonClick = useCallback(() => {
    dispatch(toggleFilter({ category }))
  }, [category])

  return (
    <Box>
      <FilterButtonBox className={showMore ? 'show-more' : ''}>
        <button onClick={showMore ? handleFilterButtonClick : undefined}>
          <FilterAltIcon className="icon filter" />
          <span>Filter</span>
          <ArrowDropDownOutlinedIcon
            className={`icon arrow ${!isFilterOpen ? 'open' : 'close'}`}
          />
        </button>
      </FilterButtonBox>
      <SelectedFiltersList
        toggleChangeFiltersPopupType={toggleChangeFiltersPopup}
      />
      <ChangeSelectedFiltersBox>
        {/* If target filter is empty, will show all available filters */}
        <button onClick={toggleChangeFiltersPopup(true)('') as () => void}>
          <LayersOutlinedIcon className="icon layer" />
          <span>필터 변경</span>
        </button>
      </ChangeSelectedFiltersBox>
    </Box>
  )
}
