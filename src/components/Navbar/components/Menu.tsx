import MenuIcon from '@mui/icons-material/Menu'
import { Drawer } from '@mui/material'
import { ModalNavLink, NavLink } from 'components'
import { ModalRoutes } from 'constant'
import { useCallOnMediaChange, useDeviceDetect, useEmptyRoute } from 'hooks'
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState
} from 'react'
import styled from 'styled-components'
import { media } from 'styles'

const MenuBox = styled.div`
  justify-content: center;
  margin-right: 50px;

  ${media.mobile`
    padding-top: 3px;
    margin-right: 10px;
  `}
`
const DesktopMenu = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;

  a {
    border-radius: 5px;
    padding: 8px 10px;
  }
  a:hover {
    background-color: ${({ theme }) => theme.colors.primary100};
    color: ${({ theme }) => theme.colors.primary};
  }
  span {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: bold;
    line-height: 20px;
    color: ${({ theme }) => theme.colors.primary300};
  }
  span.active {
    color: ${({ theme }) => theme.colors.primary};
  }
  span:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const MobileMenu = styled.button`
  cursor: pointer;
  padding: 3px;

  .menu-icon {
    font-size: 42px;
  }

  :focus-visible {
    outline: 2px solid black;
  }
`

const DrawerLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  background-color: ${({ theme }) => theme.colors.white};
`
const MobileMenuListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: ${({ theme }) => theme.colors.white};
  margin-top: 54px;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 36px;
    border-radius: 3px;
  }
  a:hover {
    background-color: ${({ theme }) => theme.colors.primary100};
  }
  a.active {
    background-color: ${({ theme }) => theme.colors.primary200};
  }
  span {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 18px;
    font-weight: bold;
    line-height: 20px;
    color: ${({ theme }) => theme.colors.primary300};
  }
  span.active {
    color: ${({ theme }) => theme.colors.primary};
  }
  span:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export type MenuProps = {
  menuList: {
    menu: string
    to: string
  }[]
}

type MenuListProps = Pick<MenuProps, 'menuList'> & {
  onMenuSelect: (event: MouseEvent | KeyboardEvent) => void
  isMobile?: boolean
}

const MenuList = ({ menuList, onMenuSelect, isMobile }: MenuListProps) => {
  return (
    <>
      {menuList &&
        menuList.map(({ menu, to }) => {
          const Link = ModalRoutes.includes(to) ? ModalNavLink : NavLink
          return (
            <Link
              key={menu}
              to={to}
              onClick={onMenuSelect as MouseEventHandler}
              onKeyDown={onMenuSelect as KeyboardEventHandler}
              // On mobile menu, the menu drawer pushes an empty route to history,
              // so that user can go back to the previous page by clicking the back button.
              // When navigating to other pages, the empty route is removed by replacing it
              // with the new route.
              replace={isMobile ? true : false}
            >
              {({ isActive }) => (
                <span className={isActive ? 'active' : undefined}>{menu}</span>
              )}
            </Link>
          )
        })}
    </>
  )
}

const Menu = ({ menuList }: MenuProps) => {
  const [open, setOpen] = useState(false)
  const { isDesktopFriendly, isMobile, isFoldable } = useDeviceDetect()

  const { toggleModal: toggleDrawer, clearEmptyRoute } = useEmptyRoute({
    setOpen
  })

  const handleClose = useCallback(() => setOpen(false), [setOpen])
  // @Issue: The browser gets zoomed if switched fast enough between mobile and desktop view to show the drawer.
  const handleResize = useCallback(() => {
    if (open) {
      clearEmptyRoute()
    }
  }, [open, clearEmptyRoute])

  // hide menu if not on mobile device
  useCallOnMediaChange(handleResize)

  // Menu list component for both desktop and mobile
  const MenuListComponent = useCallback(
    ({ isMobile }: { isMobile?: boolean }) => (
      <MenuList
        menuList={menuList}
        onMenuSelect={handleClose}
        isMobile={isMobile}
      />
    ),
    [menuList, handleClose, isMobile]
  )

  return (
    <MenuBox>
      {/* desktop and foldable menu */}
      {isFoldable || isDesktopFriendly ? (
        <DesktopMenu data-cy="desktop-menu">
          <MenuListComponent />
        </DesktopMenu>
      ) : null}

      {/* mobile menu */}
      {isMobile ? (
        <>
          <MobileMenu
            onClick={toggleDrawer(true)}
            tabIndex={0}
            data-cy="mobile-menu"
          >
            <MenuIcon className="menu-icon" />
          </MobileMenu>
          <Drawer
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
            sx={{
              zIndex: 99999
            }}
            transitionDuration={150}
            tabIndex={-1}
            data-cy="mobile-menu-drawer"
          >
            <DrawerLayout>
              <MobileMenuListBox>
                <MenuListComponent isMobile={true} />
              </MobileMenuListBox>
            </DrawerLayout>
          </Drawer>
        </>
      ) : null}
    </MenuBox>
  )
}

export default Menu
