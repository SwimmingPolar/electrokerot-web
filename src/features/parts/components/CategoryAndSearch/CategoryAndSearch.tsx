import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'app'
import {
  CategoryAndSearchHeight,
  PartsCategoriesKr,
  PartsCategoriesType
} from 'constant'
import { InputLayover, selectFilters, setQuery } from 'features'
import { useDeviceDetect } from 'hooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'

const Box = styled(Content)`
  display: flex;
  flex-direction: row;
  font-family: ${({ theme }) => theme.fonts.primary};
  height: ${CategoryAndSearchHeight.desktopLarge + 'px'};
  color: ${({ theme }) => theme.colors.primary};
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  h1 {
    width: fit-content;
  }

  ${media.mobile`
    position: relative;
    z-index: ${ElementDepth.parts.navbar - 1} !important;
  `}

  ${media.device('mobile', 'foldable')`
    height: ${CategoryAndSearchHeight.mobile + 'px'};
  `}
  ${media.tablet`
    height: ${CategoryAndSearchHeight.tablet + 'px'};
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

const IconBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 15px;
  gap: 5px;

  button {
    cursor: pointer;
  }

  .icon {
    font-size: 32px;
  }

  ${media.device('mobile', 'foldable')`
    margin-right: 5px;
    flex: 1;
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
  flex-shrink: 1;

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

  ${media.device('mobile', 'foldable')`
    width: 100%;
    margin-right: 5px;
  `}
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
    background-color: ${({ theme }) => theme.colors.primary200};
  }
`

type CategoryAndSearchType = {
  handleForceModalOpen: (state?: boolean) => void
} & React.HTMLAttributes<HTMLDivElement>

export const CategoryAndSearch = ({
  handleForceModalOpen,
  ...rest
}: CategoryAndSearchType) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { isMobile } = useDeviceDetect()
  const { category } = useParams() as { category: PartsCategoriesType }
  const dispatch = useDispatch()

  // Handle input change
  const query =
    useSelector(state => selectFilters(state)?.[category]?.query) || ''
  const [value, setValue] = useState(query)
  // If the query changes, update the value
  useEffect(() => {
    setValue(query)
  }, [category, query])
  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setValue(event.currentTarget.value)
    },
    []
  )

  // Handle modal open
  const handleModalOpen = useCallback(() => {
    handleForceModalOpen && handleForceModalOpen()
  }, [handleForceModalOpen])

  // Handle input ux
  // Enter: will set the query
  // Escape: will cancel the query and restore the backup
  const [showInput, setShowInput] = useState(false)
  // Handle show input button click
  const handleShowInput = useCallback(() => {
    setShowInput(prev => !prev)
  }, [showInput])
  // Focus handler
  const handleFocus = useCallback(() => {
    // Backup query on focus
    setBackupQuery(value)
    // Show input on focus
    setShowInput(true)
  }, [value])
  // Blur handler
  const handleBlur = useCallback(() => {
    setShowInput(false)
  }, [value])
  const [backupQuery, setBackupQuery] = useState(value)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      let query = ''
      if (event.key === 'Escape') {
        query = backupQuery
        ;(event.currentTarget as HTMLInputElement).blur()
      } else if (event.key === 'Enter') {
        query = value
        setBackupQuery(value)
      }
      // Set the query when the user presses enter or escape
      if (event.key === 'Escape' || event.key === 'Enter') {
        dispatch(
          setQuery({
            category,
            query
          })
        )
      }
    },
    [category, value, backupQuery]
  )

  // Handle search button click
  const handleSearch = useCallback(() => {
    dispatch(
      setQuery({
        category,
        query: value
      })
    )
  }, [value])

  // Handle show input layover
  const handleShow = useCallback(
    (state: boolean) => {
      setShowInput(state)
    },
    [setShowInput]
  )

  return (
    <Box {...rest}>
      <Category>
        <h1>{PartsCategoriesKr[category].toUpperCase()}</h1>
      </Category>
      <IconBox>
        {/* On mobile, show the search layover */}
        {isMobile && showInput ? (
          <InputLayover handleShow={handleShow} />
        ) : null}
        {isMobile ? (
          <>
            <IconButton tabIndex={0} onClick={handleShowInput}>
              <SearchIcon className="icon search-icon" />
            </IconButton>
          </>
        ) : (
          <Search>
            <SearchInput
              type="text"
              placeholder="검색"
              tabIndex={0}
              spellCheck={false}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
            <SearchButtonBox>
              <SearchButton tabIndex={0} onClick={handleSearch}>
                <SearchIcon />
              </SearchButton>
            </SearchButtonBox>
          </Search>
        )}
        <IconButton tabIndex={0} onClick={handleModalOpen}>
          <LayersOutlinedIcon className="icon filter-icon" />
        </IconButton>
      </IconBox>
    </Box>
  )
}
