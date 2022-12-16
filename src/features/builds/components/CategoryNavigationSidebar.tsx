import { NavLink } from 'components'
import { FC } from 'react'
import styled from 'styled-components'
import { media } from 'styles'
import { PartsCategories, PartsCategoriesKr } from 'types'

const Box = styled.div`
  flex-direction: column;
  width: 200px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.primary200};
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.25);

  ${media.mobile`
    width: 70px;
  `}
  ${media.tablet`
    width: 96px;
  `}
  ${media.desktopSmall`
    width: 64px
  `}

  /* Show the sidebar on the right side by default */
  order: 2;

  /* On desktop devices, move the sidebar to left side */
  ${media.desktop`
    order: 1 !important;
  `}
`

const CategoriesBox = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  margin-top: 120px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  gap: 10px;

  ${media.mobile`
    margin-top: 0;
    gap: 0;
  `}
  ${media.tablet`
    margin-top: 98px;
  `}
  ${media.desktopSmall`
    margin-top: 64px;
    gap: 15px;
  `}
`

const LinkBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 55px;
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.white};

  a {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.active {
      font-weight: bold;
    }
  }

  ${media.mobile`
    width: 70px;
    height: 50px;
    border: 1px solid ${({ theme }) => theme.colors.primary200};
    margin-top: -1px;

    &:first-child {
      margin-top: 0;
    }

    :hover {
      color: ${({ theme }) => theme.colors.blue300};
      border: 1px solid ${({ theme }) => theme.colors.blue300};
      z-index: 99999;
    }

    :has(a.active) {
      color: ${({ theme }) => theme.colors.blue300};
    }

    a {
      font-size: 12px;
    }
  `}

  ${media.tablet`
    width: 96px;
    height: 96px;

    :hover {
      background-color: none;
    }
    :has(a.active) {
      color: ${({ theme }) => theme.colors.blue300};
    }

    a {
      font-size: 16px;
      gap: 7px;
    }
  `}

  ${media.desktopSmall`
    width: 64px;
    height: 75px;

    :hover {
      background-color: ${({ theme }) => theme.colors.primary100};
    }
    :has(a.active) {
      background-color: ${({ theme }) => theme.colors.primary100};
    }

    a {
      font-size: 12px;
      gap: 5px;
    }
  `}

  ${media.desktopLarge`
    border-radius: 5px;
    border: 1px solid transparent;
    transition-duration: 0.15s;
    
    :hover {
      background-color: ${({ theme }) => theme.colors.primary100};
      border: 1px solid ${({ theme }) => theme.colors.primary200};
    }

    :has(a.active) {
      background-color: ${({ theme }) => theme.colors.primary100};
      border: 1px solid ${({ theme }) => theme.colors.primary};
    }

    a {
      gap: 15px;
      flex-direction: row;
      justify-content: normal;
    }
  `}
`

const MenuIcon = styled.div<{ url: string }>`
  width: 35px;
  height: 35px;
  background-color: ${({ theme }) => theme.colors.primary};
  mask: url(${({ url }) => url}) center/contain no-repeat;

  ${media.mobile`
    display: none;
  `}

  ${media.tablet`
    width: 54px;
    height: 54px;
    &.active {
      background-color: ${({ theme }) => theme.colors.blue300};
    }
  `}

  ${media.desktopSmall`
    width: 45px;
    height: 45px;
  `}
  ${media.desktopLarge`
    margin-left: 25px;
  `}
`

const Categories = () => (
  <>
    {PartsCategories.map(category => (
      <LinkBox key={category}>
        <NavLink to={`/parts/${category}`}>
          {({ isActive }) => (
            <>
              <MenuIcon
                url={`../assets/icons/${category}.png`}
                className={isActive ? 'active' : ''}
              />
              <span>{PartsCategoriesKr[category]}</span>
            </>
          )}
        </NavLink>
      </LinkBox>
    ))}
  </>
)

export const CategoryNavigationSidebar: FC = () => {
  return (
    <Box>
      <CategoriesBox>
        <Categories />
      </CategoriesBox>
    </Box>
  )
}
