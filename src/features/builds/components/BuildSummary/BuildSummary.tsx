import { BuildPartsCategories, BuildSummaryWidth, NavbarHeight } from 'constant'
import {
  BuildPart,
  BuildSummaryCard,
  BuildSummaryCardPartsCategoriesType,
  BuildSummaryFooter,
  BuildSummaryLayout
} from 'features'
import { useScrollbarWidth } from 'hooks'
import { FC } from 'react'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'
import { build } from '../../../../../cypress/fixtures'

const Box = styled.aside<{ scrollbarWidth: number }>`
  display: none;
  background-color: ${({ theme }) => theme.colors.surface};
  z-index: ${ElementDepth.parts.buildSummary};
  position: fixed;
  height: calc(100vh - ${NavbarHeight + 'px'});
  bottom: 0;
  right: 0;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  border-left: 1px solid ${({ theme }) => theme.colors.primary200};
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.07);

  ${media.desktopSmall`
    width: ${BuildSummaryWidth.desktopSmall + 'px'};

    &.scrollbar-padding--enabled {
      width: ${({ scrollbarWidth }: any) =>
        BuildSummaryWidth.desktopSmall + scrollbarWidth + 'px'};
    }
  `}
  ${media.desktopLarge`
    width: ${BuildSummaryWidth.desktopLarge + 'px'};
    &.scrollbar-padding--enabled {
      width: ${({ scrollbarWidth }: any) =>
        BuildSummaryWidth.desktopLarge + scrollbarWidth + 'px'};
    }
  `}
  ${media.desktop`
    display: flex;
  `}
`

const BoxPadding = styled.div`
  overflow-y: scroll;

  ${media.mobile`
    width: ${BuildSummaryWidth.mobile + 'px'};
  `}
  ${media.foldable`
    width: ${BuildSummaryWidth.foldable + 'px'};
  `}
  ${media.tablet`
    width: ${BuildSummaryWidth.tablet + 'px'};
  `}
  ${media.desktopSmall`
    width: ${BuildSummaryWidth.desktopSmall + 'px'};
  `}
  ${media.desktopLarge`
    width: ${BuildSummaryWidth.desktopLarge + 'px'};
  `}
  ${media.desktop`
    order: 0 !important;
  `}
`

const ContentBox = styled.div<{ scrollbarWidth: number }>`
  flex: 1;
  overflow-y: scroll;
  margin-right: ${({ scrollbarWidth }) => -scrollbarWidth + 'px'};
  overscroll-behavior: contain;

  &.scrollbar-padding--enabled {
    margin-right: ${({ scrollbarWidth }) => -scrollbarWidth * 2 + 'px'};
  }
`

export const BuildSummary: FC = () => {
  const scrollbarWidth = useScrollbarWidth()
  // Reformat the selected parts to be used in the BuildSummaryCard.
  // We need to group ssd/hdd and system/cpuCooler together to show them in one card.
  // At the same time, format into something we can easily use when rendering the BuildSummaryCard.
  const selectedParts = BuildPartsCategories.reduce((acc, partCategory) => {
    // @Todo: change this data to be received from the store.
    const part = build.parts[partCategory]

    let key: BuildSummaryCardPartsCategoriesType
    switch (partCategory) {
      case 'ssd':
      case 'hdd':
        key = 'storage'
        break
      case 'systemCooler':
      case 'cpuCooler':
        key = 'cooler'
        break
      default:
        key = partCategory
    }
    // If the array value in the accumulator doesn't exist, create it.
    if (!Array.isArray(acc[key])) {
      acc[key] = []
    }

    // If the value is not undefined, push it to the array.
    part && acc[key].push(part)

    return acc
  }, {} as Record<BuildSummaryCardPartsCategoriesType, BuildPart[]>)

  return (
    <>
      <BoxPadding className="scrollbar-padding" />
      <Box scrollbarWidth={scrollbarWidth} className="scrollbar-padding">
        <ContentBox
          scrollbarWidth={scrollbarWidth}
          className="scrollbar-padding build-summary"
        >
          <BuildSummaryLayout>
            <>
              {Object.entries(selectedParts).map(
                ([partCategory, parts], index) => (
                  <BuildSummaryCard
                    key={index}
                    partCategory={
                      // Conversion needed because key extracted from the object is a string.
                      partCategory as BuildSummaryCardPartsCategoriesType
                    }
                    parts={parts}
                  />
                )
              )}
            </>
          </BuildSummaryLayout>
          <BuildSummaryFooter />
        </ContentBox>
      </Box>
    </>
  )
}
