import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { IconButton, Link } from '@mui/material'
import { useDispatch, useSelector } from 'app'
import {
  CategoryAndSearchHeight,
  NavbarHeight,
  PartsCategoriesType
} from 'constant'
import { selectFilters, setQuery } from 'features'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ElementDepth } from 'styles'

const DropShadowZIndex = ElementDepth.parts.navbar - 10
const ContentZIndex = DropShadowZIndex + 1

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
    padding: 0 10px 0 15px;
    z-index: ${ContentZIndex};

    input[type='text'] {
      flex: 1;
    }
    .icon-box {
      display: flex;
      flex-direction: row;
    }
  }
`
const SearchResultBox = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  z-index: ${ContentZIndex};

  > div {
    padding: 10px 15px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

    &:last-of-type {
      border-bottom: none;
    }
  }

  /* Style for search result items */
  &.result {
    .item {
      a {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: none;
        width: fit-content;
      }
    }
  }
`

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  position: absolute;
  z-index: ${DropShadowZIndex};
`

type InputLayoverProps = {
  handleShow: (value: boolean) => void
}

export const InputLayover = ({ handleShow }: InputLayoverProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
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

  const dispatch = useDispatch()
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
    handleShow(false)
  }, [setNewQuery])
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleShow(false)
      } else if (event.key === 'Enter') {
        setNewQuery()
        handleShow(false)
      }
    },
    [setNewQuery]
  )

  const handleClearSearch = useCallback(() => {
    setValue('')
  }, [])

  // Handle backdrop click and back button click
  const handleCancel = useCallback(() => {
    handleShow(false)
  }, [])

  // Handle click on search result item
  const handleItemClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const value =
        (event.target as HTMLSpanElement).getAttribute('data-value') || ''
      if (value.length === 0) {
        return
      }
      dispatch(
        setQuery({
          category,
          query: value
        })
      )
      handleShow(false)
    },
    [category]
  )

  // Focus to the input when the component is mounted
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Box>
      <Content>
        <SearchBox>
          <IconButton className="back">
            <ArrowBackOutlinedIcon
              sx={{
                fontSize: 28
              }}
              onClick={handleCancel}
            />
          </IconButton>
          <div className="input">
            <input
              type="text"
              ref={inputRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
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
        <SearchResultBox className="result">
          {data.map((item, index) => (
            <div key={index} className="item">
              <Link onClick={handleItemClick}>
                <span data-value={item}>{item}</span>
              </Link>
            </div>
          ))}
        </SearchResultBox>
      </Content>
      <Backdrop onClick={handleCancel} />
    </Box>
  )
}
