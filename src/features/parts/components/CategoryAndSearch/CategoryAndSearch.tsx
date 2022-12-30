import SearchIcon from '@mui/icons-material/Search'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import { PartsCategoriesKr, PartsCategoriesType } from 'constant'
import { useDeviceDetect } from 'hooks'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'

const Box = styled(Content)`
  display: flex;
  flex-direction: row;
  z-index: ${ElementDepth.parts.category};
  font-family: ${({ theme }) => theme.fonts.primary};
  height: 72px;
  color: ${({ theme }) => theme.colors.primary};
  justify-content: space-between;
  align-items: center;

  ${media.tablet`
    height: 64px;
  `}
  ${media.mobile`
    height: 48px;
  `}
`

const Category = styled.div`
  display: flex;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  margin-left: 20px;

  h1 {
    font-size: 24px;
  }

  ${media.tablet`
    margin-left: 30px;
  `}

  ${media.desktop`
    margin-left: 50px;
    h1 {
      font-size: 32px;
    }
  `}
`

const Search = styled.div`
  height: 32px;
  width: 300px;
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  border-radius: 5px;
  overflow: hidden;
  margin-right: 15px;
  position: relative;

  ${media.tablet`
    height: 42px;
    width: 400px;
    border-radius: 20px;
  `}
  ${media.desktop`
    height: 42px;
    width: 450px;
  `}
`
const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding-left: 15px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.gray100};

  ::placeholder {
    font-size: 16px;
    font-weight: bold;
  }
`

const SearchButtonBox = styled.div`
  width: 45px;
  height: 32px;
  margin: -1px -1px;
  right: 0;
  bottom: 0;
  position: absolute;
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  background-color: ${({ theme }) => theme.colors.gray100};

  ${media.device('tablet', 'desktopSmall', 'desktopLarge')`
    width: 55px;
    height: 42px;
  `}
`

const SearchButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  cursor: pointer;
`

const IconBox = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 15px;

  gap: 5px;

  .icon {
    font-size: 32px;
  }
`

export const CategoryAndSearch: FC = () => {
  const { category } = useParams() as { category: PartsCategoriesType }
  const { isMobileFriendly } = useDeviceDetect()
  return (
    <Box>
      <Category>
        <h1>{PartsCategoriesKr[category].toUpperCase()}</h1>
      </Category>
      {!isMobileFriendly ? (
        <Search>
          <SearchInput type="text" placeholder="검색" />
          <SearchButtonBox>
            <SearchButton>
              <SearchIcon />
            </SearchButton>
          </SearchButtonBox>
        </Search>
      ) : (
        <IconBox>
          <SearchIcon className="icon search-icon" />
          <LayersOutlinedIcon className="icon filter-icon" />
        </IconBox>
      )}
    </Box>
  )
}
