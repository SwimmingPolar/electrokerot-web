import { Button, Checkbox } from '@mui/material'
import { useDispatch } from 'app'
import { addPartToCompare, Part, removePartToCompare } from 'features'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { media } from 'styles'
import { TableRowBox, TableRowElement } from '..'

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
    ${media.mobile`
      a {
        white-space: normal;
        line-height: 1.5;
      }
    `}
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    ${media.mobile`
      justify-content: space-between;

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

    ${media.mobile`
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

    span {
      font-weight: 800;
    }

    button {
      color: ${({ theme }) => theme.colors.primary};
      border: 1px solid ${({ theme }) => theme.colors.primary};
      transition: background-color 0.125s ease-in-out;
      font-family: ${({ theme }) => theme.fonts.secondary};
      font-weight: 800;
      width: 42px;
      font-size: 12px;

      ${media.desktop`
        width: 64px;
        font-size: 14px;
      `}

      :hover {
        background-color: ${({ theme }) => theme.colors.primary100};
      }
    }
  }

  ${media.mobile`
    padding: 10px 20px 15px 20px;

    .MuiCheckbox-root {
      padding: 5px 5px 5px 0;
      margin-left: -1px;
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
  justify-content: space-between;
  width: 100%;

  > div {
    flex: 1;
  }
`

const ContentBox = styled.div``

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

  const MemoizedCheckbox = useMemo(
    () => (
      <Checkbox
        className="checkbox"
        checked={isChecked}
        disabled={!isChecked && isDisabled}
        onClick={handleCheckboxClick}
        sx={{
          '&.MuiCheckbox-root': {
            flexShrink: 0
          },
          '& .MuiSvgIcon-root': {
            fontSize: '20px'
          }
        }}
      />
    ),
    [isChecked, isDisabled]
  )

  const NameElement = useMemo(() => {
    const nameOfThePart = part.name.fullName
    return (
      <TableRowElement className="name">
        <span>
          {MemoizedCheckbox}
          <a
            onClick={() => {
              //
            }}
          >
            {nameOfThePart}
          </a>
        </span>
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
            <Button variant="outlined">담기</Button>
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
