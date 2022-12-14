import { useDispatch } from 'app'
import { ModalRoutesType } from 'constant'
import {
  clearModalKeys,
  closeModal,
  openModal,
  selectModalStates
} from 'features'
import { useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'

export const useOpenModalOnMount = (page: ModalRoutesType) => {
  const dispatch = useDispatch()
  const isOpened = useSelector(selectModalStates)[page]

  useLayoutEffect(() => {
    // If the modal is not opened, open it.
    if (!isOpened) {
      dispatch(openModal(page))

      // Closing the modal will take place in backdrop component
      // when the user navigates away from the modal page.
      // Because backdrop is the only component that is rendered once
      // when navigating between modal pages, hence it is the right place to
      // dispatch the action that marks all modals as closed
    }
  }, [])
}

export const useCloseModalOnUnmount = () => {
  const modalStates = useSelector(selectModalStates)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    // close all modal open states when modal is closed
    return () => {
      dispatch(clearModalKeys())
      Object.keys(modalStates).forEach(page => {
        dispatch(closeModal(page as ModalRoutesType))
      })
    }
  }, [])
}
