import { Checkbox, FormControlLabel } from '@mui/material'
import React, { useCallback, useMemo } from 'react'
import { palette } from 'styles'

export const OptionCheckbox = ({
  value,
  checkType,
  handleOptionChange
}: {
  value: string
  checkType: 'unchecked' | 'checked' | 'minus'
  handleOptionChange: (value: string) => void
}) => {
  const checked = useMemo(() => checkType === 'checked', [checkType])
  const minusChecked = useMemo(() => checkType === 'minus', [checkType])

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

export const MemoizedOptionCheckbox = React.memo(OptionCheckbox)
