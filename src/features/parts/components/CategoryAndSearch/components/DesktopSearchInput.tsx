import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton } from '@mui/material'
import { useDispatch } from 'app'
import { PartsCategoriesType } from 'constant'
import { SearchResult, setQuery } from 'features'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'

const BorderRadius = 5

// Handle border color individually on each elements. Due to layout,
// when hovered on the Wrapper, SearchResult component will be take into account
// elements with border: InputBox, SearchButtonBox

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 32px;
  width: 280px;
  margin-right: 15px;
  position: relative;
  flex-shrink: 1;

  :hover,
  :has(.search-input:focus) {
    .search-input-box {
      border-color: ${({ theme }) => theme.colors.primary};
    }
    .search-button-box {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  ${media.device('mobile', 'foldable')`
    width: 100%;
  `}
  ${media.foldable`
    margin-right: 0;
  `}
  ${media.tablet`
    height: 42px;
    width: 400px;
    border-radius: 7px;
  `}
  ${media.desktop`
    height: 42px;
    width: 450px;
  `}

  .search-result {
    display: none;

    /*  Prevent the result list from disappearing when
        clicked on the children list items */
    &:hover {
      display: flex;
    }
  }
  /* Show the result when children gains the focus */
  &:focus-within {
    .search-result {
      display: flex;
    }
  }
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0;
  height: 100%;
`

const InputBox = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  border-top-left-radius: ${BorderRadius + 'px'};
  border-bottom-left-radius: ${BorderRadius + 'px'};
  transition: border 0.2s ease-in-out;
`

const Input = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 0 0 15px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.gray100};
  border-top-left-radius: ${BorderRadius + 'px'};
  border-bottom-left-radius: ${BorderRadius + 'px'};
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 16px;
  width: 100px;

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

const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.gray100};
`

const SearchResultWrapper = styled.div`
  position: relative;
  width: 100%;
`

const SearchResultBox = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  top: 7px;
  padding: 9px 0;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  /* Search result stays below the navbar but above everything */
  z-index: ${ElementDepth.parts.navbar - 1};

  .search-result-item {
    background-color: ${({ theme }) => theme.colors.white};
    padding: 10px 15px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
    overflow: hidden;

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
      overflow: hidden;
    }
  }
`

const SearchButtonBox = styled.div`
  width: 45px;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.primary200};
  border-left: none;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-top-right-radius: ${BorderRadius + 'px'};
  border-bottom-right-radius: ${BorderRadius + 'px'};
  transition: border 0.2s ease-in-out;

  ${media.device('tablet', 'desktopSmall', 'desktopLarge')`
    width: 55px;
  `}
`

const SearchButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;

  :focus-visible {
    background-color: ${({ theme }) => theme.colors.primary200};
  }
`

const SearchResultData = [
  'Lorem, ipsum dolor.',
  'A, quod optio.',
  'Dolorem, ducimus labore.',
  'Blanditiis, ipsam id.',
  'Repellendus, neque modi.'
]

type DesktopSearchInputProps = {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
} & React.HTMLAttributes<HTMLInputElement>

export const DesktopSearchInput = ({
  value,
  setValue,
  ...rest
}: DesktopSearchInputProps) => {
  const dispatch = useDispatch()
  const { category } = useParams() as { category: PartsCategoriesType }

  // Ref for the wrapper
  const wrapperRef = useRef<HTMLDivElement>(null)
  // Ref for the input
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle input change
  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setValue(event.currentTarget.value)
    },
    []
  )

  // To force the result to hide
  const [forceShowResult, setForceShowResult] = useState(false)

  // Backup for the query
  const [backupQuery, setBackupQuery] = useState(value)

  // Use for keyboard selection
  const [keyboardSelection, setKeyboardSelection] = useState(-1)

  // To show/hide erase query button conditionally based on the input value
  // If it has a value, show the erase button or hide it
  const hasQuery = useMemo(() => value?.length || 0, [value])

  // Show the search result when
  // the query is not empty and
  // the focus is on the input
  const shouldShowSearchResult = useMemo(() => {
    return hasQuery && SearchResultData.length > 0 && forceShowResult
  }, [hasQuery, SearchResultData, forceShowResult])

  // Focus handler
  const handleFocus = useCallback(() => {
    // Gain focus-within when the input is focused
    setForceShowResult(true)
    // Backup query on focus
    setBackupQuery(value)
  }, [value])

  /**
    Input Interactions
    Enter: will set the query
    Escape: will cancel the query and restore the backup
  */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Loose focus on escape (This will close the search result)
        ;(event.currentTarget as HTMLInputElement).blur()
        // Restore the backup query
        setValue(backupQuery)
      } else if (event.key === 'Enter') {
        // Close the search result
        setForceShowResult(false)
        // Set the backup to the new query
        setBackupQuery(value)
        // Set the new query
        dispatch(
          setQuery({
            category,
            query: value
          })
        )
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // If should not show the search result, then do nothing
        if (!shouldShowSearchResult) {
          return
        }

        // Prevent the default action just in case
        event.preventDefault()

        // Get the current selection
        const currentSelection = keyboardSelection
        const direction = event.key === 'ArrowDown' ? 1 : -1
        const newSelection =
          // If the current selection is the first/last item,
          // then select the first/last item
          currentSelection + direction < 0 ||
          currentSelection + direction >= SearchResultData.length
            ? // When the selection range is out of bound
              // Which means the current selection is the first/last item
              // Select the first/last item base on the direction
              direction === 1
              ? // Select the first item if the direction is down
                0
              : // Select the last item if the direction is up
                SearchResultData.length - 1
            : // When the selection range is in bound
              // just calculate the new selection
              currentSelection + direction

        // Set new selection
        setKeyboardSelection(newSelection)
        // Set the value of the input
        // to the value of the selected item
        setValue(SearchResultData[newSelection])
      }
    },
    [category, value, backupQuery, SearchResultData, shouldShowSearchResult]
  )

  const handleSearch = useCallback(() => {
    dispatch(
      setQuery({
        category,
        query: value
      })
    )
  }, [category, value])

  const handleClearSearch = useCallback(() => {
    // Clear the input
    setValue('')
    // And focus to the input
    inputRef.current?.focus()
  }, [])

  // Handler for after the search like event is triggered.
  // In this case, loose the focus
  const handleAfterClick = useCallback(() => {
    setForceShowResult(false)
  }, [])

  return (
    <Wrapper ref={wrapperRef}>
      <Box>
        <InputBox className="search-input-box">
          <Input
            {...rest}
            type="text"
            placeholder="검색"
            tabIndex={0}
            spellCheck={false}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className="search-input"
          />
          {hasQuery ? (
            <ButtonBox>
              <IconButton onClick={handleClearSearch}>
                <CloseOutlinedIcon />
              </IconButton>
            </ButtonBox>
          ) : null}
        </InputBox>

        {shouldShowSearchResult ? (
          <SearchResultWrapper className="search-result">
            <SearchResultBox>
              <SearchResult
                category={category}
                searchResults={SearchResultData}
                keyboardSelection={keyboardSelection}
                setKeyboardSelection={setKeyboardSelection}
                onAfterClick={handleAfterClick}
              />
            </SearchResultBox>
          </SearchResultWrapper>
        ) : null}
      </Box>
      <SearchButtonBox className="search-button-box">
        <SearchButton tabIndex={0} onClick={handleSearch}>
          <SearchIcon />
        </SearchButton>
      </SearchButtonBox>
    </Wrapper>
  )
}
