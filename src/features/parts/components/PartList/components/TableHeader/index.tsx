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

type TableHeaderProps = {
  headerNames: string[]
}

export const TableHeader = ({ headerNames }: TableHeaderProps) => {
  return (
    <Box>
      <TableRowBox>
        {headerNames.map((headerName, index) => (
          <TableRowElement key={index}>
            <span>{headerName}</span>
          </TableRowElement>
        ))}
      </TableRowBox>
    </Box>
  )
}
