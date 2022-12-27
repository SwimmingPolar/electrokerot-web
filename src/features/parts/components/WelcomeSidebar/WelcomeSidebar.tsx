import { WelcomeSidebarWidth } from 'constant'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'

const Outer = styled.div`
  display: none;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.25);
  z-index: ${ElementDepth.parts.sidebar};

  ${media.desktopSmall`
    display: flex;
    width: ${WelcomeSidebarWidth.desktopSmall + 'px'}
  `}
  ${media.desktopLarge`
    display: flex;
    width: ${WelcomeSidebarWidth.desktopLarge + 'px'}
  `}
`
const Inner = styled.div`
  display: flex;
  flex-direction: column;
  margin: 6rem 0 0 2rem;
  height: 100%;

  gap: 1.25rem;

  .title {
    font-family: 'Nanum Pen Script', cursive;
    font-size: 48px;
    color: ${({ theme }) => theme.colors.black};
  }
  .comment {
    font-family: 'Nanum Myeongjo', serif;
    font-size: 14px;
    letter-spacing: 2px;
    font-style: italic;
    color: ${({ theme }) => theme.colors.black};
  }
`

type WelcomeSidebarProps = {
  title: string
  comment: string
}

export const WelcomeSidebar = ({ title, comment }: WelcomeSidebarProps) => {
  return (
    <Outer data-cy="welcome-sidebar">
      <Inner>
        <h1 className="title">{title}</h1>
        <h4 className="comment">{comment}</h4>
      </Inner>
    </Outer>
  )
}
