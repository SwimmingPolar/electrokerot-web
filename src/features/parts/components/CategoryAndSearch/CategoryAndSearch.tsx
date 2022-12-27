import { ContentLayout as Content } from '../ContentLayout/ContentLayout'
import { FC } from 'react'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'
import { useParams } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'

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
  margin-left: 50px;

  h1 {
    font-size: 32px;
  }
`

const Search = styled.div`
  width: 450px;
  height: 42px;
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  border-radius: 5px;
  overflow: hidden;
  margin-right: 20px;
  position: relative;
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
  width: 55px;
  height: 42px;
  margin: -1px -1px;
  right: 0;
  bottom: 0;
  position: absolute;
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  background-color: ${({ theme }) => theme.colors.gray100};
`

const SearchButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  cursor: pointer;
`

export const CategoryAndSearch: FC = () => {
  const { category } = useParams()
  return (
    <Box>
      <Category>
        <h1>{category?.toUpperCase()}</h1>
      </Category>
      <Search>
        <SearchInput type="text" placeholder="검색" />
        <SearchButtonBox>
          <SearchButton>
            <SearchIcon />
          </SearchButton>
        </SearchButtonBox>
      </Search>
    </Box>
  )
}
