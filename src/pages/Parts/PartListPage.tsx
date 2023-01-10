import { PageLayout } from 'components'
import {
  BuildSummaryWidth,
  CategoryNavigationSidebarWidth,
  Gap
} from 'constant'
import {
  BuildSummary,
  CategoryAndSearch,
  CategoryNavigationSidebar,
  Filter,
  PartList
} from 'features'
import { useDeviceDetect } from 'hooks'
import { FC } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

const NavbarBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;

  > * {
    order: 2;
  }
`
const PageBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: relative;
`

const Content = styled.div`
  display: flex;
  /* @Important: This is import for the Section component. Without this section,
                 'div' will not take up all the left space */
  flex: 1;
  flex-direction: column;

  ${media.mobile`
    gap: ${Gap.mobile};
  `}
  ${media.tablet`
    gap: ${Gap.tablet + 'px'}};
  `}
  ${media.desktop`
    gap: ${Gap.desktop + 'px'}};
  `}
`

// Because of the navbar's 'position: fixed', the left part of the navbar
// will be hidden behind the sidebar. So we need to subtract the width of
// the sidebar from the navbar's width.
// The sidebar is not visible from mobile friendly view, so we don't need
// to subtract the width of the sidebar from the navbar's width.
export const PartListPage: FC = () => {
  // Make sure sidebar is visible only on desktop
  const { isDesktop } = useDeviceDetect()

  const { desktopSmall, desktopLarge } = CategoryNavigationSidebarWidth
  const sidebarWidth = {
    desktopSmall,
    desktopLarge
  }

  return (
    // NavbarBox is needed to make the sidebar sticky
    <NavbarBox>
      <PageLayout sidebarWidth={sidebarWidth}>
        {/* PageBox is actual box component */}
        <PageBox>
          <Content>
            <CategoryAndSearch />
            <Filter />
            <PartList />
          </Content>
          {/* Show build summary only on desktop */}
          {isDesktop ? <BuildSummary /> : <CategoryNavigationSidebar />}
        </PageBox>
      </PageLayout>
      {isDesktop && <CategoryNavigationSidebar />}
    </NavbarBox>
  )
}
