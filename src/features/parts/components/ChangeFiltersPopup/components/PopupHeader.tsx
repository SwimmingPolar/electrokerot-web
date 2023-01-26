import RestartAltIcon from '@mui/icons-material/RestartAlt'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
  ChangeFilterPopupDimension,
  PartsCategories,
  PartsCategoriesKr,
  PartsCategoriesType
} from 'constant'
import { useMemo } from 'react'
import styled from 'styled-components'

const Box = styled.div`
  display: flex;
`

const SelectBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  height: 58px;
  width: ${ChangeFilterPopupDimension.withoutTargetFilter.default.width}px;
  padding: 1px 0 0 25px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary200};
  border-top-left-radius: 7px;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 3;
  justify-content: space-between;

  .select-box {
    font-size: 14px;
    font-weight: 700;
    font-family: ${({ theme }) => theme.fonts.secondary};
  }

  .select-item {
  }
`

const RestoreButtonBox = styled.div`
  margin-right: 15px;
  button {
    cursor: pointer;
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 3px;

    .icon.reset {
      font-size: 22px;
      color: ${({ theme }) => theme.colors.gray300};
      transition: 0.2s color ease-in-out;
    }

    span {
      color: ${({ theme }) => theme.colors.gray300};
      font-size: 13px;
      font-weight: 700;
      font-family: ${({ theme }) => theme.fonts.secondary};
      transition: 0.2s color ease-in-out;
    }

    &:hover {
      .icon.reset {
        color: ${({ theme }) => theme.colors.primary};
      }
      span {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`

type PopupHeaderType = {
  targetFilter: string | undefined
  category: PartsCategoriesType
  handleChangeCategory: (event: SelectChangeEvent) => void
  handleResetFilters: () => void
}

export const PopupHeader = ({
  targetFilter,
  category,
  handleChangeCategory,
  handleResetFilters
}: PopupHeaderType) => {
  if (targetFilter) {
    return null
  }

  const styles = useMemo(
    () => ({
      formControl: {
        minWidth: '150px'
      },
      select: {
        padding: '0 30px'
      },
      menuItem: {
        fontSize: '13px'
      }
    }),
    []
  )

  return (
    <Box>
      <SelectBox>
        <FormControl sx={styles.formControl} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={handleChangeCategory}
            label="category"
            sx={styles.select}
            className="select-box"
          >
            {PartsCategories.map((category, index) => (
              <MenuItem key={index} value={category} sx={styles.menuItem}>
                {PartsCategoriesKr[category]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <RestoreButtonBox>
          <button onClick={handleResetFilters}>
            <span>필터 초기화</span>
            <RestartAltIcon className="icon reset" />
          </button>
        </RestoreButtonBox>
      </SelectBox>
    </Box>
  )
}
