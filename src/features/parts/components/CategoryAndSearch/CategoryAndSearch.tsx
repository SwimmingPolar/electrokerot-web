import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { PartsCategoriesKr, PartsCategoriesType } from 'constant'
import { useDeviceDetect } from 'hooks'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { media } from 'styles'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'

const Box = styled(Content)`
  display: flex;
  flex-direction: row;
  font-family: ${({ theme }) => theme.fonts.primary};
  height: 72px;
  color: ${({ theme }) => theme.colors.primary};
  justify-content: space-between;
  align-items: center;

  ${media.device('mobile', 'foldable')`
    height: 54px;
  `}
  ${media.tablet`
    height: 64px;
  `}
`

const Category = styled.div`
  display: flex;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  margin-left: 20px;
  pointer-events: none;

  h1 {
    font-size: 24px;
    margin-bottom: -2.5px;
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

  :hover {
    transition: border 0.2s ease-in-out;
    border: 1px solid ${({ theme }) => theme.colors.primary};

    div {
      transition: border 0.2s ease-in-out;
      border: 1px solid ${({ theme }) => theme.colors.primary};
    }
  }

  :has(input:focus) {
    transition: border 0.2s ease-in-out;
    border: 1px solid ${({ theme }) => theme.colors.primary};

    div {
      transition: border 0.2s ease-in-out;
      border: 1px solid ${({ theme }) => theme.colors.primary};
    }
  }

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
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 16px;
  transition: color border 0.2s ease-in-out;

  ::placeholder {
    color: ${({ theme }) => theme.colors.primary200};
    font-size: 16px;
    font-weight: 700;
  }

  :focus,
  :hover {
    color: ${({ theme }) => theme.colors.primary};

    ::placeholder {
      transition: color 0.2s ease-in-out;
      color: ${({ theme }) => theme.colors.primary};
    }
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

  :focus-visible {
    background-color: ${({ theme }) => theme.colors.primary300};
  }
`

const IconBox = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 15px;
  gap: 5px;

  button {
    cursor: pointer;
  }

  .icon {
    font-size: 32px;
  }
`

type CategoryAndSearchType = {
  handleForceModalOpen: (state?: boolean) => void
} & React.HTMLAttributes<HTMLDivElement>

export const CategoryAndSearch = ({
  handleForceModalOpen,
  ...rest
}: CategoryAndSearchType) => {
  const { category } = useParams() as { category: PartsCategoriesType }
  const { isMobileFriendly } = useDeviceDetect()

  return (
    <Box {...rest}>
      <Category>
        <h1>{PartsCategoriesKr[category].toUpperCase()}</h1>
      </Category>
      {!isMobileFriendly ? (
        <Search>
          <SearchInput
            type="text"
            placeholder="검색"
            tabIndex={0}
            spellCheck={false}
          />
          <SearchButtonBox>
            <SearchButton tabIndex={0}>
              <SearchIcon />
            </SearchButton>
          </SearchButtonBox>
        </Search>
      ) : (
        <IconBox>
          <button tabIndex={0}>
            <SearchIcon className="icon search-icon" />
          </button>
          <button tabIndex={0}>
            <LayersOutlinedIcon
              className="icon filter-icon"
              onClick={() => handleForceModalOpen()}
            />
          </button>
        </IconBox>
      )}
    </Box>
  )
}
