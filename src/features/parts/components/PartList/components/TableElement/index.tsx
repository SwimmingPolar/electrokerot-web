import { ReactNode } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

export const TableRowBox = styled.div`
  display: flex;
  flex-direction: row;

  /* Part list style for mobile */
  ${media.mobile`
  flex-direction: column;
    flex-wrap: wrap;
  `}

  .name {
    min-width: 240px;
    flex-shrink: 0;
    flex-grow: 1;
  }
  .price {
    flex: 1 0 18%;
  }
  ${media.desktop`
    .name {
      min-width: 280px;
    }
  `}
`

export const TableElementBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;

  &.element {
    height: 64px;
  }

  span {
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
