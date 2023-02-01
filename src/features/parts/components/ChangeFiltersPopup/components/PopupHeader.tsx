import RestartAltIcon from '@mui/icons-material/RestartAlt'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import {
  ChangeFiltersPopupWidth,
  PartsCategories,
  PartsCategoriesKr,
  PartsCategoriesType
} from 'constant'
import { DeviceType, useDeviceDetect } from 'hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

const Box = styled.div`
  display: flex;

  button[tabIndex='0']:focus-visible {
    outline: 2px solid black;
  }
`

export const SelectBoxHeight = 58

const SelectBox = styled.div<{ device: DeviceType }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  height: ${SelectBoxHeight + 'px'};
  ${({ device }) => `
    width: ${ChangeFiltersPopupWidth(device, undefined)};
  `};
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

  ${media.mobileExtraSmall`
    display: none;
  `}
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

  const [open, setOpen] = useState(false)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])
  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      setOpen(false)
      handleChangeCategory(event)
    },
    [handleChangeCategory]
  )
  useEffect(() => {
    window.addEventListener('resize', onClose)
    return () => {
      window.removeEventListener('resize', onClose)
    }
  }, [onClose])

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

  const { device, isMobileFriendly } = useDeviceDetect()

  const selectStyle = useMemo(
    () => ({
      width: isMobileFriendly ? 125 : 150
    }),
    [isMobileFriendly]
  )

  return (
    <Box>
      <SelectBox device={device}>
        <FormControl sx={styles.formControl} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="category"
            className="select-box"
            sx={styles.select}
            open={open}
            onChange={handleChange}
            onOpen={onOpen}
            onClose={onClose}
            tabIndex={0}
            style={selectStyle}
          >
            {PartsCategories.map((category, index) => (
              <MenuItem key={index} value={category} sx={styles.menuItem}>
                {PartsCategoriesKr[category]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <RestoreButtonBox>
          <button onClick={handleResetFilters} tabIndex={0}>
            <span>필터 초기화</span>
            <RestartAltIcon className="icon reset" />
          </button>
        </RestoreButtonBox>
      </SelectBox>
    </Box>
  )
}
