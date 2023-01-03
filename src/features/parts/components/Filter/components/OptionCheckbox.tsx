import { Checkbox, FormControlLabel } from '@mui/material'
import { useCallback, useMemo } from 'react'

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
  const handleChange = useCallback(() => {
    handleOptionChange(value)
  }, [handleOptionChange])

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
