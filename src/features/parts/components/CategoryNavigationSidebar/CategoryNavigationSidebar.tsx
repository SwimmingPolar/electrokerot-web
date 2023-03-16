import { NavLink } from 'components'
import {
  CategoryNavigationSidebarWidth,
  NavbarHeight,
  PartsCategories,
  PartsCategoriesKr
} from 'constant'
import { BuildSummaryFooter } from 'features'
import { useDeviceDetect, useScrollbarWidth } from 'hooks'
import React, { FC } from 'react'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'

const CategoriesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.25);
  /* Default depth to build summary as it will replace build summary on mobile view */
  z-index: ${ElementDepth.parts.sidebar};
  overflow: hidden;
  height: 100%;
  position: fixed;

  ${media.device('mobile', 'foldable')`
    box-shadow: none;
    width: ${CategoryNavigationSidebarWidth.mobile + 'px'};
    position: fixed;
    right: 0;
    bottom: 0;
    top: ${NavbarHeight + 'px'};
    height: 100%;
    border-left: none;
    /* On mobile, put the sidebar below the search result lay */
    z-index: ${ElementDepth.parts.searchResultLayover};
  `}
  ${media.tablet`
    width: ${CategoryNavigationSidebarWidth.tablet + 'px'};
    position: fixed;
    right: 0;
    bottom: 0;
    height: calc(100vh - ${NavbarHeight + 'px'});

    /* On tablet, put the sidebar below the navbar */
    z-index: ${ElementDepth.parts.navbar - 1};
  `}
  ${media.desktopSmall`
    width: ${CategoryNavigationSidebarWidth.desktopSmall + 'px'};
  `}
  ${media.desktopLarge`
    width: ${CategoryNavigationSidebarWidth.desktopLarge + 'px'};
  `}
  ${media.desktop`
    /* This is to stay above global navbar */
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding-right: 0 !important;
    margin-right: 0 !important;
  `}

  /* Show the sidebar on the right side by default */
  order: 2;

  /* On desktop devices, move the sidebar to left side */
  ${media.desktop`
    order: 1 !important;
  `}

  ${media.mobileExtraSmall`
    display: none;
  `}
`

const Padding = styled.div`
  ${media.device('mobile', 'foldable')`
    width: ${CategoryNavigationSidebarWidth.mobile + 'px'};
  `}
  ${media.tablet`
    width: ${CategoryNavigationSidebarWidth.tablet + 'px'};
  `}
  ${media.desktopSmall`
    width: ${CategoryNavigationSidebarWidth.desktopSmall + 'px'};
  `}
  ${media.desktopLarge`
    width: ${CategoryNavigationSidebarWidth.desktopLarge + 'px'};
  `}
  ${media.desktop`
    order: 0 !important;
  `}
  ${media.mobileExtraSmall`
    display: none;
  `}
`

const CategoriesBox = styled.div<{ scrollbarWidth: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  overscroll-behavior: contain;
  height: 100%;

  ${media.device('mobile', 'foldable')`
    gap: 0;
    overflow-y: scroll;
    /* To account for 'Box' component's border-left  */
    margin-right: ${({ scrollbarWidth }: any) => -scrollbarWidth + 'px'};

    > :last-child {
      flex: 1;
      width: 100%;
      padding-bottom: 100px;
      border-left: 1px solid ${({ theme }) => theme.colors.primary200};
    }
  `}
  ${media.tablet`
    gap: 5px;
    overflow-y: scroll;
    margin-right: ${({ scrollbarWidth }: any) => -scrollbarWidth + 'px'};
    padding-top: 55px;
    padding-bottom: 50px;
  `}
  ${media.desktopSmall`
    margin-top: 75px;
    gap: 15px;
  `}
  ${media.desktopLarge`
    margin-top: 120px;
    gap: 10px;
  `}
  ${media.desktop`
    padding-right: 0 !important;
    margin-right: 0 !important;
  `}
`

const LinkBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 18px;
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.white};
  flex-shrink: 0;

  a {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.active {
      /* @Issue: font-weight: 800 Korean not supported */
      font-weight: bold;
    }
  }

  ${media.device('mobile', 'foldable')`
    height: 50px;
    border: 1px solid ${({ theme }) => theme.colors.primary200};
    margin-top: -1px;
    
    :hover {
      color: ${({ theme }) => theme.colors.blue300};
    }

    a {
      font-size: 12px;
      font-weight: 600;
      font-family: ${({ theme }) => theme.fonts.primary};
    }

    a.active {
      font-weight: 700;
      color: ${({ theme }) => theme.colors.blue300};
    }
  `}

  ${media.tablet`
    height: 96px;

    :has(a.active) {
      color: ${({ theme }) => theme.colors.primary};
    }

    a {
      font-size: 16px;
      line-height: 18px;
      gap: 5px;
    }
  `}

  ${media.desktopSmall`
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
    width: 180px;
    height: 55px;
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

  a:focus-visible {
    outline: none;
    background-color: ${({ theme }) => theme.colors.primary200};
  }
`

const MenuIcon = styled.div<{ url: string }>`
  width: 35px;
  height: 35px;
  background-color: ${({ theme }) => theme.colors.primary};
  mask: url(${({ url }) => url}) center/contain no-repeat;

  ${media.device('mobile', 'foldable')`
    display: none;
  `}

  ${media.tablet`
    width: 48px;
    height: 48px;
    &.active {
      background-color: ${({ theme }) => theme.colors.primary};
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
        <NavLink to={`/parts/${category}`} tabIndex={0}>
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
  const scrollbarWidth = useScrollbarWidth()
  const { isMobileFriendly, isTablet } = useDeviceDetect()

  return (
    <>
      <Padding />
      <CategoriesWrapper>
        <CategoriesBox scrollbarWidth={scrollbarWidth}>
          <Categories />
          {/* Render dummy div on mobile to fill the border-left */}
          {isMobileFriendly ? <div /> : null}
        </CategoriesBox>
        {isMobileFriendly || isTablet ? <BuildSummaryFooter /> : null}
      </CategoriesWrapper>
    </>
  )
}
