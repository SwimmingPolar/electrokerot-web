import { BuildSummaryWidth, NavbarHeight } from 'constant'
import { useScrollbarWidth } from 'hooks'
import { FC } from 'react'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'

const Box = styled.aside`
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
  `}
  ${media.desktopLarge`
    width: ${BuildSummaryWidth.desktopLarge + 'px'};
  `}
  ${media.desktop`
    display: flex;
  `}
`

const ContentBox = styled.div<{ scrollbarWidth: number }>`
  flex: 1;
  overflow-y: scroll;
  margin-right: ${({ scrollbarWidth }) => -scrollbarWidth + 'px'};
  overscroll-behavior: contain;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 2000px;
`

export const BuildSummary: FC = () => {
  const scrollbarWidth = useScrollbarWidth()

  return (
    <Box>
      <ContentBox scrollbarWidth={scrollbarWidth} className="scrollbar-padding">
        <Content>
          {Array.from({ length: 100 }).map((_, index) => (
            <div key={index}>{index}</div>
          ))}
        </Content>
      </ContentBox>
    </Box>
  )
}