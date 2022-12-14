import styled from 'styled-components'
import { elementDepth, media } from 'styles'
import Logo from './components/Logo'
import Menu, { MenuProps } from './components/Menu'

const NAVBAR_HEIGHT = 60

const NavbarBox = styled.div`
  flex-direction: column;
`

const TopPadding = styled.div<{ fixed?: boolean }>`
  flex-basis: ${({ fixed }) => (fixed ? NAVBAR_HEIGHT : 0)}px;
`

const FixedNavBox = styled.div`
  position: relative;
`

const FixedNav = styled.div<{ fixed?: boolean; fullWidth?: boolean }>`
  position: ${({ fixed }) => (fixed ? 'fixed' : 'relative')};
  width: 100%;
  height: ${NAVBAR_HEIGHT}px;
  top: 0;
  z-index: ${elementDepth.parts.navbar};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary200};
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;

  ${({ fullWidth }) =>
    !fullWidth &&
    media.desktopSmall`
    width: calc(100% - 450px);
  `}

  ${({ fullWidth }) =>
    !fullWidth &&
    media.desktopLarge`
    width: calc(100% - 580px);
  `}
`

// type MenuList = MenuProps['menuList']
export type NavbarProps = {
  fixed?: boolean
  fullWidth?: boolean
  siteName?: string
  menuList: MenuProps['menuList']
}

export const navbarProps = {
  fixed: true,
  fullWidth: false,
  siteName: '#견적서',
  menuList: [
    {
      menu: '부품',
      to: '/parts'
    },
    {
      menu: '견적서',
      to: '/builds'
    },
    {
      menu: '로그인',
      to: '/login'
    }
  ]
} as NavbarProps

export const Navbar = ({
  fixed,
  fullWidth,
  siteName,
  menuList
}: NavbarProps) => {
  return (
    <NavbarBox className="navbar">
      <TopPadding fixed={fixed} />
      <FixedNavBox>
        <FixedNav
          fixed={fixed}
          fullWidth={fullWidth}
          className="scrollbar-padding"
        >
          <Logo siteName={siteName} />
          <Menu menuList={menuList} />
        </FixedNav>
      </FixedNavBox>
    </NavbarBox>
  )
}
