import { Button, Checkbox } from '@mui/material'
import { useDispatch } from 'app'
import { addPartToCompare, Part, removePartToCompare } from 'features'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { media } from 'styles'
import { TableRowBox, TableRowElement } from '..'
import { Link as NavLink } from 'components'

const Box = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary200};

  :last-of-type {
    border-bottom: none;
  }

  .checkbox {
    :hover {
      background-color: transparent;
    }
  }

  .name {
    ${media.device('mobile', 'foldable')`
      a {
        white-space: normal;
        line-height: 1.5;
        font-weight: 800;
        font-size: 14px;
        margin-top: -2px;
        color: ${({ theme }) => theme.colors.primary};
        margin-left: 5px;
      }
    `}
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${media.device('mobile', 'foldable')`
      justify-content: space-between;
      padding-left: 3px;

      > div:nth-child(2) {
        span {
          flex: 1;
          text-align: center;
        }
      }
      > div:last-of-type {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    `}
  }

  .price {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 5px;
    font-weight: 800;

    ${media.device('mobile', 'foldable')`
      span {
        font-size: 14px;
      }
    `}
    ${media.tablet`
      padding-left: 0;
      justify-content: space-around;  
    `}
    ${media.desktop`
      padding-left: 0;
      justify-content: space-around;
    `}

  .MuiButton-root {
      color: ${({ theme }) => theme.colors.primary};
      border: 1px solid ${({ theme }) => theme.colors.primary};
      transition: background-color 0.125s ease-in-out;
      font-family: ${({ theme }) => theme.fonts.primary};
      font-weight: 800;
      font-size: 12px;

      ${media.tablet`
        padding: 5px 10px;
        min-width:48px
      `}
      ${media.desktopSmall`
        padding: 5px 12px;
        min-width: 54px;
      `}
      ${media.desktop`
        font-size: 14px;
      `}

      :hover {
        background-color: ${({ theme }) => theme.colors.primary100};
      }
    }
  }

  ${media.mobile`
    padding: 15px 10px;

    .MuiCheckbox-root {
      padding: 5px;
      margin-left: 0px;
    }

    .price span {
      font-weight: 600;
    }
  `}
  ${media.foldable`
    padding: 15px 25px;
  `}

  ${media.tablet`
    .MuiCheckbox-root {
      padding: 5px;
    }
  `}
`

const TableContentGroup = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  pointer-events: none;

  > div {
    flex: 1;
  }
`

const ContentBox = styled.div`
  ${media.mobileSmall`
    > div:nth-child(2) {
      display: none;
    }
  `}
`

type TableRowProps = {
  headerNames: string[]
  part: Part
  isChecked: boolean
  isDisabled: boolean
}
export const TableRow = ({
  headerNames,
  part,
  isChecked,
  isDisabled
}: TableRowProps) => {
  const dispatch = useDispatch()
  const handleCheckboxClick = useCallback(() => {
    if (isChecked) {
      dispatch(removePartToCompare(part._id))
    } else {
      dispatch(addPartToCompare(part._id))
    }
  }, [isChecked])

  const checkboxStyle = useMemo(
    () => ({
      '&.MuiCheckbox-root': {
        flexShrink: 0
      },
      '& .MuiSvgIcon-root': {
        fontSize: '20px'
      }
    }),
    []
  )

  const MemoizedCheckbox = useMemo(
    () => (
      <Checkbox
        className="checkbox"
        checked={isChecked}
        disabled={!isChecked && isDisabled}
        onClick={handleCheckboxClick}
        sx={checkboxStyle}
        tabIndex={0}
      />
    ),
    [isChecked, isDisabled]
  )

  const NameElement = useMemo(() => {
    const nameOfThePart = part.name.fullName
    return (
      <TableRowElement className="name">
        <div>
          <div className="compare-checkbox">{MemoizedCheckbox}</div>
          <span>
            <NavLink
              to={`/part/${nameOfThePart.replace(/\s/g, '%20')}`}
              tabIndex={0}
            >
              {nameOfThePart}
            </NavLink>
          </span>
        </div>
      </TableRowElement>
    )
  }, [MemoizedCheckbox, part.name.fullName])

  const ContentElement = useMemo(
    () => (
      <ContentBox className="content">
        {headerNames.map((headerName, index) => {
          // Ignore the name and price
          // They are handled separately
          if (['부품명', '가격'].includes(headerName)) return null

          const value = part.details[headerName]?.value || null
          return (
            <TableRowElement key={index} className="content">
              <span>{value}</span>
            </TableRowElement>
          )
        })}
      </ContentBox>
    ),
    [headerNames, part]
  )

  const PriceElement = useMemo(() => {
    // Get the latest price
    const price = part.prices[part.prices.length - 1].value || null
    return (
      <TableRowElement className="price">
        {price ? (
          <>
            <span>
              {price.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              <span>원</span>
            </span>
            <Button variant="outlined" tabIndex={0} focusRipple={false}>
              담기
            </Button>
          </>
        ) : null}
      </TableRowElement>
    )
  }, [part])

  const render = useMemo(
    () => (
      <Box>
        <TableRowBox>
          {NameElement}
          <TableContentGroup>{ContentElement}</TableContentGroup>
          {PriceElement}
        </TableRowBox>
      </Box>
    ),
    [NameElement, ContentElement, PriceElement]
  )

  return render
}

export const MemoizedTableRow = React.memo(TableRow)
