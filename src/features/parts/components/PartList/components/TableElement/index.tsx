import { ReactNode } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

export const TableRowBox = styled.div`
  display: flex;
  flex-direction: row;

  /* Part list style for mobile */
  ${media.device('mobile', 'foldable')`
    flex-direction: column;
    flex-wrap: wrap;
  `}

  .name {
    min-width: 180px;
    flex-shrink: 1;
    flex-grow: 1;

    ${media.tablet`
      min-width: 240px;
    `}
    ${media.desktop`
      min-width: 280px;
    `}
  }
  .price {
    flex: 1 0 18%;
  }
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
    font-family: ${({ theme }) => theme.fonts.primary};
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
