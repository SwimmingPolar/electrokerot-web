import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import classnames from 'classnames'
import { PartsCategoriesKr, PartsCategoriesType } from 'constant'
import { BuildPart, BuildSummaryCardPartsCategoriesType } from 'features'
import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

// Check if the user can adjust the count of the parts in the build
const isCountAdjustable = (
  partCategory: BuildSummaryCardPartsCategoriesType
) => {
  const countAdjustablePartCategories = ['memory', 'ssd', 'hdd', 'cooler']
  return countAdjustablePartCategories.includes(partCategory)
}
// Decide if the user can change the count value by select box or text input
// If the user can change the count value by select box, return the array of options
// else, return true to show the text input
const isTextOrSelect = (partCategory: BuildSummaryCardPartsCategoriesType) => {
  if (!isCountAdjustable(partCategory)) {
    return null
  }

  switch (partCategory) {
    case 'memory':
      return [1, 2, 4, 8]
    case 'storage':
      return [1, 2, 4]
    case 'cooler':
      return true
    default:
      return false
  }
}

// Get the appropriate header name for the part category
const getHeaderName = (partCategory: string) => {
  switch (partCategory) {
    case 'storage':
      return 'SSD/HDD'
    default:
      return PartsCategoriesKr[partCategory as PartsCategoriesType]
  }
}

const Box = styled.div`
  border-radius: 4px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.primary200};
  border: 1px solid ${({ theme }) => theme.colors.primary200};

  &.active {
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.35);
    border: 1px solid ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.white};
  }
`

const HeaderBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 32px;
  padding: 6px 14px;
  background-color: ${({ theme }) => theme.colors.primary200};

  h3 {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: 600;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.primary300};
    pointer-events: none;
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};

    h3 {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 72px;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 11px 0 0 13px;

  /* border for non-active items */
  &:nth-of-type(n + 1).content {
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary200};
  }
  &:last-of-type.content {
    border-bottom: none;
  }
  /* border for active item */
  &:nth-of-type(n + 1).content.active {
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  }
  &:last-of-type.content.active {
    border-bottom: none;
  }
  /* For empty item */
  &.empty {
    padding-top: 0;
    pointer-events: none;
  }
`
const ContentUpperBox = styled.div`
  display: flex;

  span {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 16px;
  }
`
const ContentLowerBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  span {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 16px;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.primary300};
  }

  button.remove-button {
    cursor: pointer;
    margin-right: 15px;
    color: ${({ theme }) => theme.colors.primary300};
    transition: color 0.2s ease-in-out;
    :hover {
      color: ${({ theme }) => theme.colors.primary};
    }
    width: 40px;
    height: 40px;
  }
`

type CountInputProps = {
  partCategory: BuildSummaryCardPartsCategoriesType
  handleChange: (event: SelectChangeEvent) => void
  value: string
}
const CountInput = ({ partCategory, handleChange, value }: CountInputProps) => {
  // If the user can change the count value by select box, return the array of options
  // else, return true to show the text input
  const result = isTextOrSelect(partCategory)
  if (result === true) {
    return <input type="text" onChange={handleChange} value={value} />
  } else if (Array.isArray(result)) {
    return (
      <Select
        // autoWidth
        onChange={handleChange}
        MenuProps={{
          disableScrollLock: true
        }}
        SelectDisplayProps={{
          style: {
            padding: '4px 12px',
            marginLeft: '20px'
          }
        }}
        value={value}
      >
        {result.map((option, index) => {
          return (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          )
        })}
      </Select>
    )
  } else {
    return null
  }
}

type BuildSummaryCardProps = {
  partCategory: BuildSummaryCardPartsCategoriesType
  parts: BuildPart[]
}

export const BuildSummaryCard = ({
  partCategory,
  parts
}: BuildSummaryCardProps) => {
  // Get if the current card should be active or not
  const { category } = useParams() as { category: string }
  const isActive = useMemo(() => {
    switch (partCategory) {
      case 'storage':
        return category === 'ssd' || category === 'hdd'
      default:
        return category === partCategory
    }
  }, [category, partCategory])
  const activeClassName = useMemo(() => (isActive ? 'active' : ''), [isActive])

  const handleChange = () => {
    //
  }

  const hasParts = useMemo(() => parts && parts.length > 0, [parts])

  useEffect(() => {
    if (isActive) {
      const element = document.querySelector(`.card-${partCategory}`)
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [category])

  if (partCategory === 'reserved') {
    return null
  }

  return (
    <Box className={classnames(activeClassName, `card-${partCategory}`)}>
      <HeaderBox className={isActive ? 'active' : ''}>
        <div>
          <h3>{getHeaderName(partCategory)}</h3>
        </div>
      </HeaderBox>
      {/* If the select part exists */}
      {hasParts ? (
        parts.map((part, index) => {
          return (
            <ContentBox
              key={index}
              className={classnames(activeClassName, 'content')}
            >
              <ContentUpperBox>
                <span>{part.name}</span>
              </ContentUpperBox>
              <ContentLowerBox>
                <span>{part.price}</span>
                {/* Get appropriate input element (select or text) */}
                {CountInput({ partCategory, handleChange, value: part.count })}
                <IconButton className="remove-button" centerRipple={false}>
                  <ClearOutlinedIcon />
                </IconButton>
              </ContentLowerBox>
            </ContentBox>
          )
        })
      ) : (
        <ContentBox className="empty">
          <ContentLowerBox>
            <span>Choose your part</span>
          </ContentLowerBox>
        </ContentBox>
      )}
    </Box>
  )
}

export const MemoizedBuildSummaryCard = React.memo(BuildSummaryCard)
