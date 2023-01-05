import { FilterSideMenu } from 'constant'
import { MouseEvent, useCallback } from 'react'
import styled from 'styled-components'

const Window = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  width: ${FilterSideMenu.sideMenu.desktop.width + 'px'};
  right: 0;
  top: 0;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-x: hidden;
  overflow-y: scroll;
  overscroll-behavior: contain;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  gap: 3px;
`

const AnchorBox = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray200};

  :hover {
    background-color: ${({ theme }) => theme.colors.white};
  }
`
const Anchor = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 15px 12px;
  word-break: keep-all;
  line-height: 15px;
  font-size: 13px;
  font-weight: 800;
  font-family: ${({ theme }) => theme.fonts.secondary};
  color: ${({ theme }) => theme.colors.black};
`

export const SideMenu = ({ filterNames }: { filterNames: string[] }) => {
  const handleClick = useCallback((event: MouseEvent) => {
    event.preventDefault()
    const target = event.target as HTMLAnchorElement
    const targetId = target.getAttribute('href') || ''
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [])

  return (
    <Window>
      <Box>
        {filterNames.map((filterName, index) => (
          <AnchorBox key={index}>
            <Anchor
              href={`#${filterName.replace(
                /([^ㄱ-ㅎ|ㅏ-ㅣ|가-힣a-zA-Z]|^\d*(?=\D))/g,
                ''
              )}`}
              onClick={handleClick}
            >
              {filterName}
            </Anchor>
          </AnchorBox>
        ))}
      </Box>
    </Window>
  )
}
