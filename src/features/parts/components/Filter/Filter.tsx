import { Modal } from '@mui/material'
import { ChangeFiltersPopup } from 'features'
import { useEmptyRoute } from 'hooks'
import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'
import { MemoizedLowerBox as LowerBox } from './components/LowerBox'
import { SelectedFilterItemsBoxClassName } from './components/SelectedFiltersList'
import { MemoizedUpperBox as UpperBox } from './components/UpperBox'
import { useLoadFilterJson } from './hooks'

const Box = styled(Content)`
  z-index: ${ElementDepth.parts.category};
  padding: 20px 20px 9px 20px;
  gap: 20px;

  /* On mobile, second component which is Filter has drop-shadow
     if all the card components have the same z-index, this shadow will be hidden
     thus, increase the z-index of Filter component */
  ${media.mobile`
    z-index: ${ElementDepth.parts.category + 1};
    padding: 0 12px 12px 12px;
  `}
`

const ModalBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  ${media.desktopLarge`
    margin-left: -100px;
  `}
`

// Modal wrapper component
type ChangeFiltersPopupModalType = {
  open: boolean
  forceModalOpen?: boolean
  targetFilter?: string
  handleModalClose: () => void
  handleForceModalOpen?: (state?: boolean) => void
  toggleChangeFiltersPopup: ToggleChangeFiltersPopupType
}
const ChangeFiltersPopupModal = ({
  open,
  forceModalOpen,
  targetFilter,
  handleModalClose,
  handleForceModalOpen,
  toggleChangeFiltersPopup
}: ChangeFiltersPopupModalType) => {
  useEffect(() => {
    if (forceModalOpen) {
      // Cast the return value of toggleChangeFiltersPopup to OpenChangeFiltersPopupType
      // and execute it with empty string to open the modal with all
      // the filters available.
      ;(toggleChangeFiltersPopup(true) as OpenChangeFiltersPopupType)('')(
        null as any
      )
    }
  }, [forceModalOpen, toggleChangeFiltersPopup])

  // Set forceModalOpen to false when the modal is closed
  useEffect(() => {
    return () => {
      if (open || forceModalOpen) {
        handleForceModalOpen && handleForceModalOpen(false)
      }
    }
  }, [open, forceModalOpen])

  return (
    <Modal open={open} onClose={handleModalClose} disableScrollLock>
      <ModalBox>
        <ChangeFiltersPopup
          targetFilter={targetFilter}
          toggleChangeFiltersPopup={toggleChangeFiltersPopup}
        />
      </ModalBox>
    </Modal>
  )
}
const MemoizedChangeFiltersPopupModal = React.memo(ChangeFiltersPopupModal)

export type ToggleChangeFiltersPopupType = (
  state: boolean
) => OpenChangeFiltersPopupType | CloseChangeFiltersPopupType

type OpenChangeFiltersPopupType = (
  targetFilter: string
) => (event: MouseEvent | KeyboardEvent) => void
type CloseChangeFiltersPopupType = () => void

type FilterType = {
  // This is used to open the ChangeFiltersPopup from outside
  // of the Filter component.
  forceModalOpen: boolean
  handleForceModalOpen?: (state?: boolean) => void
}

export const Filter = ({
  forceModalOpen,
  handleForceModalOpen
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
    (
      state: boolean
    ): OpenChangeFiltersPopupType | CloseChangeFiltersPopupType => {
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
  )

  const handleModalClose = useCallback(
    () => (toggleModal(false) as CloseChangeFiltersPopupType)(),
    [toggleModal]
  )

  return (
    <Box>
      <UpperBox toggleChangeFiltersPopup={toggleChangeFiltersPopup} />
      <LowerBox />
      <MemoizedChangeFiltersPopupModal
        open={open}
        forceModalOpen={forceModalOpen}
        targetFilter={targetFilter}
        handleModalClose={handleModalClose}
        handleForceModalOpen={handleForceModalOpen}
        toggleChangeFiltersPopup={toggleChangeFiltersPopup}
      />
    </Box>
  )
}

export const MemoizedFilter = React.memo(Filter)
