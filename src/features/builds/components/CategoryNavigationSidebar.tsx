import { NavLink } from 'components'
import { FC } from 'react'
import styled, { css } from 'styled-components'
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
  ${media.device('foldable', 'tablet')`
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
  ${media.device('foldable', 'tablet')`
    margin-top: 98px;
  `}
  ${media.desktopSmall`
    margin-top: 64px;
    gap: 15px;
  `}
`

const RED = 'red'

const LinkBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 55px;
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition-duration: 0.15s;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid transparent;
  background-color: ${({ theme }) => theme.colors.white};

  :hover {
    font-weight: bold;
  }

  :has(a.active) {
    font-weight: bold;
  }

  ${media.device('foldable', 'tablet')`
    width: 96px;
    height: 96px;
  `}

  ${media.desktopSmall`
    width: 64px;
    height: 75px;
  `}

  ${media.desktopLarge`
    border-radius: 5px;
  `}

  ${media.desktopLarge`
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.white};
  `}

  a {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 15px;

    ${media.desktopSmall`
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      gap: 5px;
    `}
  }
`

const MenuIcon = styled.div<{ url: string }>`
  width: 35px;
  height: 35px;
  margin-left: 25px;
  background-color: ${({ theme }) => theme.colors.primary};
  mask: url(${({ url }) => url}) center/contain no-repeat;

  ${media.desktopSmall`
    width: 45px;
    height: 45px;
    margin-left: 0;
  `}

  ${media.tablet`
    width: 54px;
    height: 54px;
  `}
`

const Categories = () => (
  <>
    {PartsCategories.map(category => (
      <LinkBox key={category}>
        <NavLink to={`/parts/${category}`}>
          <MenuIcon url={`../assets/icons/${category}.png`} />
          <span>{PartsCategoriesKr[category]}</span>
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
