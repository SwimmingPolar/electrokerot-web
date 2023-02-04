import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'app'
import {
  CategoryAndSearchHeight,
  NavbarHeight,
  PartsCategoriesType
} from 'constant'
import { SearchResult, selectFilters, setQuery } from 'features'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'

const ContentZIndex = ElementDepth.parts.searchResultLayover
const DropShadowZIndex = ContentZIndex - 1

const Box = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: ${ContentZIndex};
`

const Content = styled.div`
  padding-top: ${NavbarHeight + 'px'};
  background-color: ${({ theme }) => theme.colors.white};
  z-index: ${ContentZIndex};
`
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  height: ${CategoryAndSearchHeight.mobile + 'px'};
  background-color: ${({ theme }) => theme.colors.white};
  z-index: ${ContentZIndex};
  padding: 7px 5px;
  gap: 10px;

  div.input {
    flex: 1;
    display: flex;
    flex-direction: row;
    background-color: ${({ theme }) => theme.colors.gray200};
    border-radius: 50px;
    padding: 0 0 0 15px;
    z-index: ${ContentZIndex};

    input[type='text'] {
      flex: 1;
      width: 100px;
    }

    .icon-box {
      display: flex;
      flex-direction: row;
    }

    ${media.mobileExtraSmall`
      padding: 0 10px 0 15px;
      .icon-box {
        display: none;
      }
    `}
  }
`
const SearchResultBox = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  z-index: ${ContentZIndex};

  .search-result-item {
    padding: 10px 15px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

    &:last-of-type {
      border-bottom: none;
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.gray200};
    }

    a {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: none;
      width: fit-content;
    }
  }

  /* Style for search result items */
`

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  position: absolute;
  z-index: ${DropShadowZIndex};
`

type MobileSearchInputProps = {
  handleShowInput: (value: boolean) => void
}

export const MobileSearchInput = ({
  handleShowInput
}: MobileSearchInputProps) => {
  const dispatch = useDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const [keyboardSelection, setKeyboardSelection] = useState(-1)
  const data = [
    'Lorem, ipsum dolor.',
    'A, quod optio.',
    'Dolorem, ducimus labore.',
    'Blanditiis, ipsam id.',
    'Repellendus, neque modi.'
  ]

  // Get the query from the store
  const { category } = useParams() as { category: PartsCategoriesType }
  const query =
    useSelector(state => selectFilters(state)?.[category]?.query) || ''
  const [value, setValue] = useState(query)
  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setValue(event.currentTarget.value)
    },
    []
  )

  const setNewQuery = useCallback(() => {
    dispatch(
      setQuery({
        category,
        query: value
      })
    )
  }, [value, category])
  const handleSearch = useCallback(() => {
    setNewQuery()
    handleShowInput(false)
  }, [setNewQuery])
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleShowInput(false)
      } else if (event.key === 'Enter') {
        setNewQuery()
        handleShowInput(false)
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // Prevent the default action just in case
        event.preventDefault()

        // Get the current selection
        const currentSelection = keyboardSelection
        const direction = event.key === 'ArrowDown' ? 1 : -1
        const newSelection =
          // If the current selection is the first/last item,
          // then select the first/last item
          currentSelection + direction < 0 ||
          currentSelection + direction >= data.length
            ? // When the selection range is out of bound
              // Which means the current selection is the first/last item
              // Select the first/last item base on the direction
              direction === 1
              ? // Select the first item if the direction is down
                0
              : // Select the last item if the direction is up
                data.length - 1
            : // When the selection range is in bound
              // just calculate the new selection
              currentSelection + direction

        // Set new selection
        setKeyboardSelection(newSelection)
        // Set the value of the input
        // to the value of the selected item
        setValue(data[newSelection])
      }
    },
    [setNewQuery, keyboardSelection, data.length]
  )

  const handleClearSearch = useCallback(() => {
    setValue('')
  }, [])

  // Handle backdrop click and back button click
  const handleCancel = useCallback(() => {
    handleShowInput(false)
  }, [])

  // Show the search result when the query is not empty and
  // the data fetched is not empty
  const shouldShowSearchResult = useMemo(() => {
    const hasQuery = value.length > 0
    return hasQuery && data.length > 0
  }, [value, data])

  // Handler for after the search like event is triggered
  // In this case, we will hide the input
  const handleAfterClick = useCallback(() => {
    handleShowInput(false)
  }, [])

  // Focus to the input when the component is mounted
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    // TabIndex -1 will prevent the focus from leaving
    // the current box when navigating with the keyboard
    <Box tabIndex={-1}>
      <Content>
        <SearchBox>
          <IconButton className="back" onClick={handleCancel}>
            <ArrowBackOutlinedIcon
              sx={{
                fontSize: 28
              }}
            />
          </IconButton>
          <div className="input">
            <input
              type="text"
              ref={inputRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              tabIndex={0}
            />
            <div className="icon-box">
              <IconButton onClick={handleClearSearch}>
                <CloseOutlinedIcon />
              </IconButton>
              <IconButton onClick={handleSearch}>
                <SearchOutlinedIcon />
              </IconButton>
            </div>
          </div>
        </SearchBox>

        {shouldShowSearchResult ? (
          <SearchResultBox>
            <SearchResult
              category={category}
              searchResults={data}
              keyboardSelection={keyboardSelection}
              setKeyboardSelection={setKeyboardSelection}
              onAfterClick={handleAfterClick}
            />
          </SearchResultBox>
        ) : null}
      </Content>
      <Backdrop onClick={handleCancel} />
    </Box>
  )
}
