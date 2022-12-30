import { CheckBox } from '@mui/icons-material'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { FilterValuesType } from 'features'
import { ChangeEvent, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useLoadFilterJson } from '../hooks/useLoadFilterJson'

const Box = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 11px;
`

// Filter Row
const FilterRowBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* align-items: center; */
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
      /* width: 150px; */
      width: calc(100% / 5);
      height: 24px;
    }

    /* Label */
    span.MuiFormControlLabel-label {
      font-size: 13px;
      font-family: ${({ theme }) => theme.fonts.primary};
      color: ${({ theme }) => theme.colors.primary400};
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
`

const OptionCheckbox = ({ value }: { value: string }) => {
  const [checked, setChecked] = useState(false)

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }, [])

  return (
    <div className={`label-box ${checked ? 'checked' : ''}`} key={value}>
      <FormControlLabel
        label={value}
        control={
          // Checkbox size
          <Checkbox
            checked={checked}
            onChange={handleChange}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
          />
        }
      />
      <div className="padding" />
    </div>
  )
}

const FilterRow = ({ category, subCategory, values }: FilterValuesType) => {
  const filterName = category || subCategory

  return (
    <FilterRowBox>
      {/* Filter Name */}
      <span className="filter-name">{filterName}</span>

      {/* Filter Options */}
      <FormGroup className="filter-options">
        {values.map((value, index) => (
          <OptionCheckbox key={index} value={value} />
        ))}
      </FormGroup>
    </FilterRowBox>
  )
}

export const LowerBox = () => {
  // Dynamically load filter json file to reduce bundle size
  const { category, filters } = useLoadFilterJson()

  return (
    <Box>
      {filters &&
        filters.map((filter, index) => <FilterRow key={index} {...filter} />)}
    </Box>
  )
}
