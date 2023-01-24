import { ReactNode } from 'react'
import styled from 'styled-components'

export const TableRowBox = styled.div`
  display: flex;
  flex-direction: row;
`

export const TableElementBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 1;
  flex-grow: 1;

  &.element {
    height: 64px;
  }

  &:first-of-type {
    flex-shrink: 0;
    flex: 25%;
  }

  &:last-of-type {
    flex-shrink: 0;
    flex: 5%;
    justify-content: space-around;
  }

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-family: ${({ theme }) => theme.fonts.secondary};
  }
`

type TableRowElementProps = {
  children: ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const TableRowElement = ({
  children,
  className,
  ...rest
}: TableRowElementProps) => {
  const mergedClassName = className ? className + ' element' : 'element'
  return (
    <TableElementBox {...rest} className={mergedClassName}>
      {children}
    </TableElementBox>
  )
}
