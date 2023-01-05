import { NavbarHeight, SidebarWidth } from 'constant'
import styled from 'styled-components'
import { DeviceList, ElementDepth, media } from 'styles'
import Logo from './components/Logo'
import Menu, { MenuProps } from './components/Menu'

const NavbarBox = styled.div`
  flex-direction: column;
`

const TopPadding = styled.div<{ fixed?: boolean }>`
  flex-basis: ${({ fixed }) => (fixed ? NavbarHeight : 0)}px;
`

const FixedNavBox = styled.div`
  position: relative;
`

type Device = keyof typeof DeviceList

const calculateNavbarWidth = (
  fullWidth?: boolean | undefined,
  sidebarWidth?: SidebarWidth | undefined
) => {
  if (fullWidth) return null

  // Loop through given sidebarWidth which contains width of the sidebar
  // that should be subtracted from the navbar width
  // and return generated css
  return Object.keys(sidebarWidth || []).map(device => {
    return media[device as Device]`
        width: calc(100% - ${sidebarWidth?.[device as Device]}px)}
      `
  })
}

const FixedNav = styled.div<{
  fixed?: boolean
  sidebarWidth?: SidebarWidth
  fullWidth?: boolean
}>`
  position: ${({ fixed }) => (fixed ? 'fixed' : 'relative')};
  width: 100%;
  height: ${NavbarHeight}px;
  top: 0;
  z-index: ${ElementDepth.parts.navbar};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary200};
  background-color: #fff;
  flex-direction: row;
  justify-content: space-between;
  color: ${props => props.fixed && props.theme.black};

  ${({ fullWidth, sidebarWidth }) =>
    calculateNavbarWidth(fullWidth, sidebarWidth)}
`

// type MenuList = MenuProps['menuList']
export type NavbarProps = {
  fixed?: boolean
  sidebarWidth?: SidebarWidth
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
  sidebarWidth,
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
          sidebarWidth={sidebarWidth}
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
