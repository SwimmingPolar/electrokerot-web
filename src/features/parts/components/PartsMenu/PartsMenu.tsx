import { NavLink } from 'components'
import { PartsMenuTypes } from 'types'
import { FC } from 'react'
import styled from 'styled-components'
import { media } from 'styles'

const PartsMenuBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  margin-top: 150px;
  padding-bottom: 75px;
  background-color: ${({ theme }) => theme.colors.background};

  ${media.mobile`
    margin-top: 65px;
  `}
  ${media.foldable`
    margin-top: 65px;
  `}
  ${media.tablet`
    margin-top: 100px;
  `}
`

const PartsMenuListBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 495px;
  gap: 30px;
  justify-content: center;
  align-items: center;

  ${media.mobile`
    width: 330px; 
    gap: 12px;
  `}
`

const PartsMenuTitleBox = styled.div`
  h3 {
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-size: 28px;
    font-weight: 800;
  }

  ${media.mobile`
    h3 {
      font-size: 21px;
    }  
  `}
`

const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 145px;
  height: 145px;
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }) => theme.colors.white};

  a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  a:hover {
    background-color: ${({ theme }) => theme.colors.primary100};
  }

  span {
    display: inline-block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 20px;
    font-weight: bold;
    font-family: Arial;
    margin-top: 15px;
  }

  ${media.mobile`
     width: 100px;
     height: 100px;

    span {
      font-size: 12px;
      margin-top: 12px;
     }
  `}
`

const MenuIconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 145px;
  height: 65px;

  ${media.mobile`
    width: 75px;
    height: 35px;
  `}
`

const MenuIcon = styled.div<{ url: string }>`
  width: 65px;
  height: 65px;
  background-color: ${({ theme }) => theme.colors.primary};
  mask: url(${({ url }) => url}) center/contain no-repeat;

  ${media.mobile`
    width: 35px;
    height: 35px;
  `}
`

const PartsNameKr = {
  cpu: 'CPU',
  motherboard: '메인보드',
  memory: '메모리',
  graphics: '그래픽카드',
  ssd: 'SSD',
  hdd: 'HDD',
  power: '파워',
  case: '케이스',
  cooler: '쿨러'
} as {
  [key: string]: string
}

const PartsMenuTitle = () => {
  return (
    <PartsMenuTitleBox>
      <h3>컴퓨터 부품 카테고리</h3>
    </PartsMenuTitleBox>
  )
}

const PartsMenuListItem = () => (
  <>
    {PartsMenuTypes.map(partsName => (
      <ImageBox key={partsName}>
        <NavLink to={`/parts/${partsName}`}>
          <MenuIconBox>
            <MenuIcon url={`../assets/icons/${partsName}.png`} />
          </MenuIconBox>
          <span>{PartsNameKr[partsName]}</span>
        </NavLink>
      </ImageBox>
    ))}
  </>
)

const PartsMenuList = () => (
  <PartsMenuListBox>
    <PartsMenuListItem />
  </PartsMenuListBox>
)

export const PartsMenu: FC = () => {
  return (
    <PartsMenuBox>
      <PartsMenuTitle />
      <PartsMenuList />
    </PartsMenuBox>
  )
}
