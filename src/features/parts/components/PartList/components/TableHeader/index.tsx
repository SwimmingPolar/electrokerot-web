import { useDeviceDetect } from 'hooks'
import { useMemo } from 'react'
import styled from 'styled-components'
import { TableRowBox, TableRowElement } from '..'

const Box = styled.div`
  pointer-events: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary200};

  :last-of-type {
    border-bottom: none;
  }

  .element {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 45px !important;
    font-weight: 800;
  }
`

const TableHeaderGroup = styled.div`
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  width: 100%;

  > div {
    flex: 1;
  }
`

type TableHeaderProps = {
  headerNames: string[]
}

export const TableHeader = ({ headerNames }: TableHeaderProps) => {
  const { isMobileFriendly } = useDeviceDetect()

  // First and last are always the name of the part and the price
  // so, we can separate them from the rest of the headers
  // The reason why we do this is because when on mobile
  // rest of the headers should be grouped in a single div
  // so they can be displayed in a single row
  const NameHeader = useMemo(() => {
    return (
      <TableRowElement className="name">
        <span>{headerNames[0]}</span>
      </TableRowElement>
    )
  }, [headerNames[0]])

  const RestOfHeaders = useMemo(() => {
    return headerNames
      .slice(1, headerNames.length - 1)
      .map((headerName, index) => (
        <TableRowElement key={index}>
          <span>{headerName}</span>
        </TableRowElement>
      ))
  }, [headerNames])

  const PriceHeader = useMemo(() => {
    return (
      <TableRowElement className="price">
        <span>{headerNames[headerNames.length - 1]}</span>
      </TableRowElement>
    )
  }, [headerNames[headerNames.length - 1]])

  // Do not render part header on mobile
  return !isMobileFriendly ? (
    <Box>
      <TableRowBox>
        {NameHeader}
        <TableHeaderGroup>{RestOfHeaders}</TableHeaderGroup>
        {PriceHeader}
      </TableRowBox>
    </Box>
  ) : null
}
