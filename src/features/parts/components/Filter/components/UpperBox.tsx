import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import styled from 'styled-components'

const Box = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 800;
  height: 42px;
`

const FilterButtonBox = styled.div`
  width: 135px;
  flex-grow: 0;
  flex-shrink: 0;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3px;
    cursor: pointer;
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
`
const SelectedFiltersBox = styled.div`
  flex: 1;
`
const ChangeSelectedFiltersBox = styled.div`
  width: 125px;
  flex-grow: 0;
  flex-shrink: 0;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

  .icon.layer {
    font-size: 28px;
    margin-top: 1px;
  }
  span {
    font-size: 22px;
  }
`

export const UpperBox = () => {
  return (
    <Box>
      <FilterButtonBox>
        <button>
          <FilterAltIcon className="icon filter" />
          <span>Filter</span>
          <ArrowDropDownOutlinedIcon className="icon arrow" />
        </button>
      </FilterButtonBox>
      <SelectedFiltersBox></SelectedFiltersBox>
      <ChangeSelectedFiltersBox>
        <button>
          <LayersOutlinedIcon className="icon layer" />
          <span>필터 변경</span>
        </button>
      </ChangeSelectedFiltersBox>
    </Box>
  )
}
