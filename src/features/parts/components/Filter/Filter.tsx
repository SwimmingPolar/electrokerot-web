import { Modal } from '@mui/material'
import { ChangeFiltersPopup } from 'features'
import { useEmptyRoute } from 'hooks'
import { FC, KeyboardEvent, MouseEvent, useCallback, useState } from 'react'
import styled from 'styled-components'
import { ElementDepth, media } from 'styles'
import { ContentLayout as Content } from '../ContentLayout/ContentLayout'
import { LowerBox } from './components/LowerBox'
import { UpperBox } from './components/UpperBox'
import { useLoadFilterJson } from './hooks/useLoadFilterJson'

const Box = styled(Content)`
  z-index: ${ElementDepth.parts.category};
  padding: 20px;
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
`

export type ToggleChangeFiltersPopupType = (
  state: boolean
) =>
  | ((targetFilter: string) => (event: MouseEvent | KeyboardEvent) => void)
  | (() => void)

export const Filter: FC = () => {
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
    [setTargetFilter, toggleModal, setOpen]
  )

  return (
    <Box>
      <UpperBox toggleChangeFiltersPopup={toggleChangeFiltersPopup} />
      <LowerBox toggleChangeFiltersPopup={toggleChangeFiltersPopup} />
      <Modal open={open} onClose={toggleModal(false)}>
        <ModalBox>
          <ChangeFiltersPopup
            targetFilter={targetFilter}
            toggleChangeFiltersPopup={toggleChangeFiltersPopup}
          />
        </ModalBox>
      </Modal>
    </Box>
  )
}
