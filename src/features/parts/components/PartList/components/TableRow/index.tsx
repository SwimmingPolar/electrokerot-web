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
  .MuiCheckbox-root {
    ${media.tablet`
      padding: 5px;
    `}
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .price {
    display: flex;
    flex-direction: row;
    padding-left: 30px;
    justify-content: space-between;

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
      <TableRowElement>
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
  }, [])

  const render = useMemo(
    () => (
      <Box>
        <TableRowBox>
          {NameElement}
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
          {PriceElement}
        </TableRowBox>
      </Box>
    ),
    [NameElement, headerNames, part]
  )

  return render
}

export const MemoizedTableRow = React.memo(TableRow)
