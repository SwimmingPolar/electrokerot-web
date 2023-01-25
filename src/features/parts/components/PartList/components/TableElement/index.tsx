import { ReactNode } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

export const TableRowBox = styled.div`
  display: flex;
  flex-direction: row;
`

export const TableElementBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;

  &.element {
    height: 64px;
  }

  &:first-of-type {
    flex: 20% 1 0;
    min-width: 240px;

    ${media.desktop`
      flex: 25%;
    `}
  }
  &:last-of-type {
    flex: 18% 1 0;
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
