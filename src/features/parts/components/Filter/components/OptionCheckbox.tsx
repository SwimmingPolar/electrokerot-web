import { Checkbox, FormControlLabel } from '@mui/material'
import { useCallback, useEffect, useMemo } from 'react'
import { palette } from 'styles'

export const OptionCheckbox = ({
  selectedValues,
  value,
  handleOptionChange
}: {
  selectedValues: string[]
  value: string
  handleOptionChange: (value: string) => void
}) => {
  const checked = useMemo(
    () => selectedValues.includes(value),
    [selectedValues]
  )
  const minusChecked = useMemo(
    () => selectedValues.includes(`!!${value}`),
    [selectedValues]
  )
  const handleChange = useCallback(() => {
    handleOptionChange(value)
  }, [handleOptionChange, value])

  return (
    <div className={`label-box ${checked ? 'checked' : ''}`} key={value}>
      <FormControlLabel
        label={value}
        control={
          // Checkbox size
          <Checkbox
            checked={checked}
            onChange={handleChange}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: checked
                  ? palette.light.blue
                  : minusChecked
                  ? palette.light.red
                  : ''
              }
            }}
            indeterminate={minusChecked}
          />
        }
      />
      <div className="padding" />
    </div>
  )
}
