import {
  CloseChangeFiltersPopupType,
  MemoizedChangeFiltersPopupModal,
  ToggleChangeFiltersPopupType
} from 'features'
import { useEmptyRoute, useScrollbarLock } from 'hooks'
import React, { KeyboardEvent, MouseEvent, useCallback, useState } from 'react'
import styled from 'styled-components'
import { media } from 'styles'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'
import { MemoizedLowerBox as LowerBox } from './components/LowerBox'
import { SelectedFilterItemsBoxClassName } from './components/SelectedFiltersList'
import { MemoizedUpperBox as UpperBox } from './components/UpperBox'
import { useLoadFilterJson } from './hooks'

const Box = styled(Content)`
  padding: 20px 20px 9px 20px;
  gap: 20px;

  /* On mobile, second component which is Filter has drop-shadow
     if all the card components have the same z-index, this shadow will be hidden
     thus, increase the z-index of Filter component */
  ${media.device('mobile', 'foldable')`
    padding: 0 10px 10px 10px;
  `}
`

type FilterType = {
  // This is used to open the ChangeFiltersPopup from outside
  // of the Filter component.
  forceModalOpen: boolean
  handleForceModalOpen?: (state?: boolean) => void
  // If there's no filters selected, hide filter on mobile
  // but need to render because of the modal
  hideFilter: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const Filter = ({
  forceModalOpen,
  handleForceModalOpen,
  hideFilter,
  ...rest
}: FilterType) => {
  // Dynamically load filter json file to reduce bundle size
  useLoadFilterJson()
  // Modal open/close state
  const [open, setOpen] = useState(false)
  // Which filters to change
  const [targetFilter, setTargetFilter] = useState('')
  // Toggle modal open/close state
  const { toggleModal } = useEmptyRoute({ setOpen })
  // Toggle handler
  const toggleChangeFiltersPopup = useCallback(
    (state: boolean) => {
      // If toggle to open, set the target filter and return function
      // that returns handler.
      if (state) {
        return (targetFilter: string) => (event: MouseEvent | KeyboardEvent) => {
          // Prevent button from being clicked while scrolling
          const container = document.querySelector(
            `.${SelectedFilterItemsBoxClassName}`
          )

          if (container?.classList.contains('scrolling') === true) {
            return
          }

          // Open popup
          setTargetFilter(targetFilter)
          toggleModal(state)(event)
        }
      }
      // If toggle to false which means closing the modal,
      // return the handler that closes the modal.
      else {
        return () => {
          setTargetFilter('')
          toggleModal(false)(null as any)
        }
      }
    },
    [toggleModal]
  ) as ToggleChangeFiltersPopupType

  const handleModalClose = useCallback(
    () => (toggleModal(false) as CloseChangeFiltersPopupType)(),
    [toggleModal]
  )

  useScrollbarLock(open)

  return (
    <>
      {hideFilter ? null : (
        <Box {...rest}>
          <UpperBox toggleChangeFiltersPopup={toggleChangeFiltersPopup} />
          <LowerBox />
        </Box>
      )}
      <MemoizedChangeFiltersPopupModal
        open={open}
        forceModalOpen={forceModalOpen}
        targetFilter={targetFilter}
        handleModalClose={handleModalClose}
        handleForceModalOpen={handleForceModalOpen}
        toggleChangeFiltersPopup={toggleChangeFiltersPopup}
      />
    </>
  )
}

export const MemoizedFilter = React.memo(Filter)
