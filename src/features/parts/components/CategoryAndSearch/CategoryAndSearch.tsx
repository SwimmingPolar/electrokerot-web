import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton } from '@mui/material'
import { useSelector } from 'app'
import {
  CategoryAndSearchHeight,
  CategoryNavigationSidebarWidth,
  FilterHeight,
  NavbarHeight,
  PartsCategoriesKr,
  PartsCategoriesType
} from 'constant'
import {
  DesktopSearchInput,
  MobileSearchInput,
  selectFilters,
  useHideOnScroll
} from 'features'
import { useDeviceDetect } from 'hooks'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  gap: 30px;
  z-index: ${ElementDepth.parts.categoryAndSearch} !important;

  h1 {
    width: fit-content;
  }

  ${media.device('mobile', 'foldable')`
    position: fixed;
    z-index: ${ElementDepth.parts.navbar - 1} !important;
    top: ${NavbarHeight + 'px'};
    width: calc(100% - ${CategoryNavigationSidebarWidth.mobile + 'px'});
    height: ${CategoryAndSearchHeight.mobile + 'px'};
  `}
  ${media.tablet`
    height: ${CategoryAndSearchHeight.tablet + 'px'};
  `}
  ${media.mobileExtraSmall`
    width: 100%;
  `}
`

// Padding for mobile devices to account for the fixed element
const BoxPadding = styled.div`
  height: ${CategoryAndSearchHeight.mobile + 'px'};
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

const ContentBox = styled.div`
  flex: 1;
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

type CategoryAndSearchType = {
  handleForceModalOpen: (state?: boolean) => void
} & React.HTMLAttributes<HTMLDivElement>

export const CategoryAndSearch = ({
  handleForceModalOpen,
  ...rest
}: CategoryAndSearchType) => {
  const { category } = useParams() as { category: PartsCategoriesType }

  // Handle input change
  const query =
    useSelector(state => selectFilters(state)?.[category]?.query) || ''
  const [value, setValue] = useState(query)
  // If the query changes, update the value
  useEffect(() => {
    setValue(query)
  }, [category, query])

  // Handle modal open
  const handleModalOpen = useCallback(() => {
    handleForceModalOpen && handleForceModalOpen()
  }, [handleForceModalOpen])

  // On mobile, decide to show/hide input layover
  const [showInput, setShowInput] = useState(false)

  // Handle show input button click (one directional toggler)
  const handleShowInputClick = useCallback(() => {
    setShowInput(true)
  }, [showInput])

  // Handle show input layover (two directional toggler)
  const handleShowInput = useCallback(
    (state: boolean) => {
      setShowInput(state)
    },
    [setShowInput]
  )

  // If the query changes, update the value
  useEffect(() => {
    setValue(query)
  }, [category, query])

  const { isMobile, isMobileFriendly } = useDeviceDetect()

  const shouldShowMobileSearchInput = useMemo(() => {
    return isMobile && showInput
  }, [isMobile, showInput])

  const shouldShowDesktopSearchInput = useMemo(() => {
    return !isMobile
  }, [isMobile])

  const boxRef = useRef<HTMLDivElement>(null)
  // Indicator to know if there are any selected filters
  const selectedFilters = useSelector(
    state => selectFilters(state)?.[category]?.selectedFilters
  )
  const hasSelectedFilters = useMemo(
    () => selectedFilters?.some(filter => filter.filterOptions.length > 0),
    [selectedFilters]
  )
  const trailingHeaderHeight = useMemo(
    () => (hasSelectedFilters ? FilterHeight.mobile : 0),
    [hasSelectedFilters]
  )

  useHideOnScroll({
    target: boxRef,
    precedingHeaderHeight: 0,
    trailingHeaderHeight
  })

  return (
    <>
      <Box {...rest} ref={boxRef}>
        <Category>
          <h1>{PartsCategoriesKr[category].toUpperCase()}</h1>
        </Category>
        <ContentBox>
          {/* Render show search input button on mobile only */}
          {isMobile ? (
            <IconButton tabIndex={0} onClick={handleShowInputClick}>
              <SearchIcon className="icon search-icon" />
            </IconButton>
          ) : null}
          {/* Search input for desktop */}
          {shouldShowDesktopSearchInput ? (
            <DesktopSearchInput value={value} setValue={setValue} />
          ) : null}
          {/* Change filters popup toggle button */}
          <IconButton tabIndex={0} onClick={handleModalOpen}>
            <LayersOutlinedIcon className="icon filter-icon" />
          </IconButton>
        </ContentBox>

        {/* Search input for mobile */}
        {shouldShowMobileSearchInput ? (
          <MobileSearchInput handleShowInput={handleShowInput} />
        ) : null}
      </Box>

      {/* Render the padding element on mobile friendly devices to account for the fixed element */}
      {isMobileFriendly ? (
        <BoxPadding className="category-and-search-padding" />
      ) : null}
    </>
  )
}
