import { useSelector } from 'app'
import { PageLayout } from 'components'
import {
  CategoryNavigationSidebarWidth,
  Gap,
  PartsCategoriesType
} from 'constant'
import {
  BuildSummary,
  CategoryAndSearch,
  CategoryNavigationSidebar,
  MemoizedFilter as Filter,
  MemoizedPartList as PartList,
  selectFilters,
  useChangeSearchParams
} from 'features'
import { useDeviceDetect } from 'hooks'
import { FC, useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'

const Box = styled.div`
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
  /* @Important: This is import for the Section component. Without this section, 'div' will not take up all the left space */
  flex: 1;
  flex-direction: column;

  ${media.mobile`
    gap: ${Gap.mobile};
  `}
  ${media.foldable`
    gap: ${Gap.foldable};
  `}
  ${media.tablet`
    gap: ${Gap.tablet + 'px'}};
  `}
  ${media.desktop`
    gap: ${Gap.desktop + 'px'}};
  `}

  > div {
    z-index: ${ElementDepth.parts.content};
  }
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
  const sidebarWidth = useMemo(
    () => ({
      desktopSmall,
      desktopLarge
    }),
    [desktopSmall, desktopLarge]
  )

  // ChangeFiltersPopup modal state
  const [forceModalOpen, setForceModalOpen] = useState(false)
  const handleForceModalOpen = useCallback((state?: boolean) => {
    setForceModalOpen(prev => {
      // If state is not given, toggle the modal
      if (state === undefined) {
        return !prev
      }
      // Else, set the modal to the given state
      else {
        return state
      }
    })
  }, [])

  // If no filters are selected, hide filters list on mobile.
  const { isMobileFriendly } = useDeviceDetect()
  // This decides where to show the layout shadow
  // If there's no filters selected, filter(lower box) will be hidden
  // thus, upper box should have shadow.
  const { category } = useParams() as { category: PartsCategoriesType }
  const hasSelectedFilters = useSelector(
    state =>
      selectFilters(state)?.[category]?.selectedFilters &&
      selectFilters(state)?.[category]?.selectedFilters.some(
        filter => filter.filterOptions.length > 0
      )
  )
  const hideFilter = useMemo(
    () => isMobileFriendly && !hasSelectedFilters,
    [isMobileFriendly, hasSelectedFilters]
  )

  // This hook changes the searchParams when the user changes the filters
  useChangeSearchParams()

  // This is needed to prevent the page from re-rendering when we set the searchParams
  const render = useMemo(
    () => (
      // NavbarBox is needed to make the sidebar sticky
      <Box>
        <PageLayout sidebarWidth={sidebarWidth}>
          {/* PageBox is actual box component */}
          <PageBox>
            <Content>
              <CategoryAndSearch
                handleForceModalOpen={handleForceModalOpen}
                // If there's no filters selected, filter(lower box) will be hidden
                // Thus, upper box should have shadow.
                className={hideFilter ? 'drop-shadow' : ''}
              />
              <Filter
                forceModalOpen={forceModalOpen}
                handleForceModalOpen={handleForceModalOpen}
                // Vice versa of the above
                className={hideFilter ? '' : 'drop-shadow'}
                hideFilter={hideFilter}
              />
              <PartList />
            </Content>
            {/* Show build summary only on desktop */}
            {isDesktop ? <BuildSummary /> : <CategoryNavigationSidebar />}
          </PageBox>
        </PageLayout>
        {isDesktop && <CategoryNavigationSidebar />}
      </Box>
    ),
    [sidebarWidth, handleForceModalOpen, forceModalOpen, isDesktop, hideFilter]
  )

  return render
}
