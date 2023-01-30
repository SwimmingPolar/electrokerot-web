import CircleIcon from '@mui/icons-material/Circle'
import { FilterSideMenu } from 'constant'
import { SelectBoxHeight, SelectedFiltersType } from 'features'
import { useDeviceDetect } from 'hooks'
import { MouseEvent, useCallback, useMemo } from 'react'
import styled from 'styled-components'

const Window = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  width: ${FilterSideMenu.sideMenu.desktop.width + 'px'};
  right: 0;
  top: 0;
  background-color: ${({ theme }) => theme.colors.white};
  overflow-x: hidden;
  overflow-y: scroll;
  overscroll-behavior: contain;

  button[tabIndex='0']:focus-visible {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`

const Box = styled.div<{ isMobileFriendly: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  gap: 3px;
  ${({ isMobileFriendly }) =>
    isMobileFriendly
      ? `
    padding-top: ${SelectBoxHeight}px;
  `
      : ''}
`

const ButtonBox = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray200};

  :hover {
    background-color: ${({ theme }) => theme.colors.white};
  }
`
const Button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px 10px;
  word-break: keep-all;
  line-height: 15px;
  font-size: 12px;
  font-weight: 800;
  font-family: ${({ theme }) => theme.fonts.secondary};
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
  cursor: pointer;
  gap: 3px;

  .icon.dot {
    flex-shrink: 0;
    display: flex;
    white-space: pre;
    text-overflow: clip;
    overflow: hidden;
  }
`

type SideMenuType = {
  targetFilter: string | undefined
  filterNames: string[]
  selectedFilters: SelectedFiltersType[]
}

export const SideMenu = ({
  targetFilter,
  filterNames,
  selectedFilters
}: SideMenuType) => {
  // Show sidebar only when showing the entire filters
  if (targetFilter) {
    return null
  }

  // Extract selected filter names to indicate which filter is active
  const selectedFilterNames = useMemo(
    () =>
      selectedFilters.map(
        selectedFilter =>
          // Extract name of selected filter
          // only if there is at least one selected option
          selectedFilter.filterOptions.length > 0 && selectedFilter.filterName
      ),
    [selectedFilters]
  )

  const handleClick = useCallback((event: MouseEvent) => {
    const headerList = Array.from(
      document.querySelectorAll('.filter-item .filter-name') || []
    )
    const targetId = (event.target as HTMLAnchorElement).getAttribute(
      'data-filter-name'
    )
    const targetElement = headerList.find(
      header => header.getAttribute('id') === targetId
    )

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [])

  const circleIconStyle = useMemo(
    () => ({
      fontSize: '4px',
      color: 'red'
    }),
    []
  )

  const { isMobileFriendly } = useDeviceDetect()

  return (
    <Window>
      <Box className="filter-box" isMobileFriendly={isMobileFriendly}>
        {filterNames.map((filterName, index) => (
          <ButtonBox key={index}>
            <Button
              data-filter-name={filterName}
              onClick={handleClick}
              tabIndex={0}
            >
              {selectedFilterNames.includes(filterName) ? (
                <span className="icon dot">
                  <CircleIcon sx={circleIconStyle} />
                </span>
              ) : (
                <div
                  style={{
                    width: '3px'
                  }}
                />
              )}

              {filterName}
            </Button>
          </ButtonBox>
        ))}
      </Box>
    </Window>
  )
}
