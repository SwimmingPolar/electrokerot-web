/* eslint-disable no-extra-boolean-cast */
import styled from 'styled-components'
import { media } from 'styles'
import { NavLink } from 'components'

const LogoBox = styled.div`
  margin-top: 2px;
  margin-left: 30px;

  h1 {
    line-height: 55px;
    text-align: center;
    font-size: 45px;
    font-family: ${({ theme }) => theme.fonts.logo};
  }

  ${media.device('mobile', 'foldable')`
    margin-left: 10px;

    h1 {
      font-size: 32px;
    }
  `}
`

type LogoProps = {
  siteName?: string
}

const Logo = ({ siteName }: LogoProps) => {
  return (
    <LogoBox>
      <NavLink to="/" style={{ overflow: 'hidden' }}>
        <h1>{siteName}</h1>
      </NavLink>
    </LogoBox>
  )
}

export default Logo
