import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import { IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import classnames from 'classnames'
import { Link as NavLink } from 'components'
import { PartsCategoriesKr, PartsCategoriesType } from 'constant'
import {
  BuildPart,
  BuildSummaryCardPartsCategoriesType,
  useScrollToCard
} from 'features'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { media } from 'styles'

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

  ${media.desktopSmall`
    height: 28px;
  `}

  h3, span {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: 600;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.primary300};
    pointer-events: none;
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};

    h3,
    span {
      color: ${({ theme }) => theme.colors.white};
    }
  }

  /* To position "/" right besides the headerNames */
  > div {
    display: flex;
    flex-direction: row;
  }
`

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 68px;
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

  ${media.desktopSmall`
    span {
      font-size: 15px;
    }
  `}
`
const ContentLowerBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  > div {
    flex: 1;
  }

  /* Width for input and select box */
  > div:nth-child(2) {
    max-width: 54px;
  }
  /* Align close button */
  > div:last-child {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  span {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 16px;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.primary300};
  }

  ${media.desktopSmall`
    span {
      font-size: 15px;
    }
  `}

  button.remove-button {
    width: 40px;
    height: 40px;
    cursor: pointer;
    margin-right: 15px;
    color: ${({ theme }) => theme.colors.primary300};
    transition: color 0.2s ease-in-out;
    :hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  /* Text input */
  input.count-input {
    border: 1px solid ${({ theme }) => theme.colors.primary200};
    border-radius: 4px;
    font-size: 16px;
    width: 54px;
    height: 28px;
    text-align: center;
    flex-grow: 0;
  }
  /* Select box */
  .MuiInputBase-root {
    width: 54px !important;
    height: 28px !important;
  }
  .MuiSelect-select {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 0 !important;

    span {
      margin: 0;
      padding-left: 15px;
    }
  }

  .MuiInputBase-input {
    width: 54px !important;
    height: 28px !important;
  }
`

type CountInputProps = {
  partCategory: BuildSummaryCardPartsCategoriesType
  handleCountChange: (event: SelectChangeEvent) => void
  value: string
}
const CountInput = ({
  partCategory,
  handleCountChange,
  value
}: CountInputProps) => {
  // If the user can change the count value by select box, return the array of options
  // else, return true to show the text input
  const result = isTextOrSelect(partCategory)
  if (result === true) {
    return (
      <input
        type="text"
        onChange={handleCountChange}
        value={value}
        className="count-input"
      />
    )
  } else if (Array.isArray(result)) {
    return (
      <Select
        onChange={handleCountChange}
        MenuProps={{
          disableScrollLock: true
        }}
        value={value}
      >
        {result.map((option, index) => {
          return (
            <MenuItem key={index} value={option}>
              <span>{option}</span>
            </MenuItem>
          )
        })}
      </Select>
    )
  } else {
    return <></>
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
  // Do not render reserved slot, it's useless
  if (partCategory === 'reserved') {
    return null
  }

  // Get if the current card should be active or not
  const { category } = useParams() as { category: string }
  // See if the current card should be active or not
  const isActive = useMemo(() => {
    switch (partCategory) {
      case 'storage':
        return category === 'ssd' || category === 'hdd'
      default:
        return category === partCategory
    }
  }, [category, partCategory])
  const activeClassName = useMemo(() => (isActive ? 'active' : ''), [isActive])
  // See if the current card should have any parts
  const hasParts = useMemo(() => parts && parts.length > 0, [parts])

  // Header name for the card
  const headerName = getHeaderName(partCategory)
  // Extract categories from the header name
  // to render the navlinks to the parts
  const categories = getCategories(headerName)

  // Handler for the when the user changes the count value
  const handleCountChange = () => {
    //
  }

  // Scroll to the card when the category changes and
  // the card is not visible within the viewport
  useScrollToCard({
    category,
    partCategory,
    isActive
  })

  return (
    <Box className={classnames(activeClassName, `card-${partCategory}`)}>
      <HeaderBox className={isActive ? 'active' : ''}>
        {categories.map((category, index) => {
          return (
            <div key={index}>
              <NavLink to={`/parts/${category}`}>
                <h3>{PartsCategoriesKr[category as PartsCategoriesType]}</h3>
              </NavLink>
              {/* If it's not the last link, it will render "/" in between the two links */}
              {index !== categories.length - 1 && <span>/</span>}
            </div>
          )
        })}
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
                <div>
                  <span>{part.price}</span>
                </div>
                <div>
                  {/* Get appropriate input element (select or text) */}
                  {CountInput({
                    partCategory,
                    handleCountChange,
                    value: part.count
                  })}
                </div>
                <div>
                  <IconButton className="remove-button" centerRipple={false}>
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
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

/**
 *
 * Miscellaneous functions
 *
 */
// Check if the user can adjust the count of the parts in the build
const isCountAdjustable = (
  partCategory: BuildSummaryCardPartsCategoriesType
) => {
  const countAdjustablePartCategories = ['memory', 'storage', 'cooler']
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
const getHeaderName = (partCategory: BuildSummaryCardPartsCategoriesType) => {
  switch (partCategory) {
    case 'storage':
      return 'SSD/HDD'
    default:
      return PartsCategoriesKr[partCategory as PartsCategoriesType]
  }
}

// Get the category from the header names
const getCategories = (headerName: string) => {
  const headerNames = headerName.toUpperCase().split('/')
  const categories = headerNames.map(headerName => {
    return Object.entries(PartsCategoriesKr)
      .map(([key, value]) => {
        if (value === headerName) {
          return key
        }
      })
      .filter(e => e)[0] as string
  })
  return categories
}
