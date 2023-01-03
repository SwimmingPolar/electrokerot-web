import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import { useDispatch, useSelector } from 'app'
import { PartsCategoriesType } from 'constant'
import { selectFilters, toggleFilter } from 'features'
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
  &.no-filters .show-more {
    cursor: default;
  }
  &.no-filters .icon.arrow {
    visibility: hidden;
  }
`

const FilterButtonBox = styled.div`
  width: 135px;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
  }

  .icon.filter {
    font-size: 28px;
    color: ${({ theme }) => theme.colors.blue300};
  }
  span {
    font-size: 24px;
  }
  .icon.arrow {
    font-size: 22px;
    color: ${({ theme }) => theme.colors.gray400};
    margin-left: 15px;
  }

  ${media.device('foldable', 'mobile')`
    display: none;
  `}
`

const ChangeSelectedFiltersBox = styled.div`
  width: 125px;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .icon.layer {
    font-size: 28px;
    margin-top: 1px;
  }
  span {
    font-size: 22px;
  }

  ${media.device('foldable', 'mobile')`
    display: none;
  `}
`

export const UpperBox = () => {
  const dispatch = useDispatch()
  const { category } = useParams() as { category: PartsCategoriesType }

  // Get filters list for the category
  const filters = useSelector(selectFilters)?.[category]

  // Check if there are more than 5 filters
  const showMore = filters && filters.length > 5

  // Show or hide filters on click
  const handleFilterButtonClick = useCallback(() => {
    dispatch(toggleFilter({ category }))
  }, [category])

  return (
    <Box className={!showMore ? 'no-filters' : ''}>
      <FilterButtonBox>
        <button
          onClick={showMore ? handleFilterButtonClick : undefined}
          className="show-more"
        >
          <FilterAltIcon className="icon filter" />
          <span>Filter</span>
          <ArrowDropDownOutlinedIcon className={'icon arrow'} />
        </button>
      </FilterButtonBox>
      <SelectedFiltersList />
      <ChangeSelectedFiltersBox>
        <button>
          <LayersOutlinedIcon className="icon layer" />
          <span>필터 변경</span>
        </button>
      </ChangeSelectedFiltersBox>
    </Box>
  )
}
