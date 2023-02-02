import { Link } from '@mui/material'
import { useDispatch } from 'app'
import classNames from 'classnames'
import { PartsCategoriesType } from 'constant'
import { setQuery } from 'features'
import React, { CSSProperties, useCallback, useMemo } from 'react'

type UseSearchResultsProps = {
  category: PartsCategoriesType
  searchResults: string[]
  keyboardSelection: number
  setKeyboardSelection: React.Dispatch<React.SetStateAction<number>>
  onAfterClick: () => void
}

export const SearchResult = ({
  category,
  searchResults,
  keyboardSelection,
  setKeyboardSelection,
  onAfterClick: handleAfterClick
}: UseSearchResultsProps) => {
  const dispatch = useDispatch()

  const handleMouseOver = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const index = (event.target as HTMLDivElement).getAttribute('data-index')
      if (index !== null) {
        setKeyboardSelection(parseInt(index))
      }
    },
    [setKeyboardSelection]
  )

  const handleMouseLeave = useCallback(() => {
    setKeyboardSelection(-1)
  }, [])

  // Handler for when the user selects an item by the mouse or keyboard
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const value =
        (event.currentTarget as HTMLDivElement).getAttribute('data-value') || ''

      if (value.length === 0) {
        return
      }
      dispatch(
        setQuery({
          category,
          query: value
        })
      )

      handleAfterClick()
    },
    [category]
  )

  // Default style
  const style = useMemo(
    () => ({
      userSelect: 'none'
    }),
    []
  ) as React.CSSProperties

  return (
    <>
      {searchResults.map((item, index) => (
        <div
          key={index}
          className={classNames(
            'search-result-item',
            index === keyboardSelection ? 'active' : null
          )}
          data-index={index}
          data-value={item}
          onClick={handleClick}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          style={style}
        >
          <Link>
            <span>{item}</span>
          </Link>
        </div>
      ))}
    </>
  )
}
