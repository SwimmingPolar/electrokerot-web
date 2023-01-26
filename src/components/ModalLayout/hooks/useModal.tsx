import { store, useDispatch, useSelector } from 'app'
import { mergeEventListeners } from 'components'
import { disableNavigationWhileAnimating } from 'components/NavLink'
import { useDecideNavigationMethod } from 'components/NavLink/useDecideNavigationMethod'
import { ModalAnimationDuration, ModalRoutesType } from 'constant'
import {
  clearModalKeys,
  selectModalKey,
  selectModalStates,
  setModalKey
} from 'features'
import {
  useCallOnBrowserNavigation,
  useMotionDecider,
  useScrollbarPadding
} from 'hooks'
import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { findNonModalLocation } from 'routes'
import { v4 as uuid } from 'uuid'
import { useEnableEscapeKey } from './useEnableEscapeKey'
import { useOpenModalOnMount } from './useOpenModalOnMount'

// This closes all modals when the user navigates away from the modal page
export const clearModal = debounce((key?: string) => {
  const { dispatch } = store
  setTimeout(() => {
    // When the modal is closed, the modal key is cleared by the backdrop component.
    // There aren't keys to clear. Hence, this is not needed. Otherwise, there will be flickering
    const { modalKeys } = store.getState().modal
    if (Object.keys(modalKeys).length === 0) {
      return
    }

    // Clear other modals except the one that is currently being opened
    dispatch(clearModalKeys(key))
  }, 0)
}, ModalAnimationDuration - 100)

export const useModal = (page: ModalRoutesType) => {
  // Ref for MUI modal
  const modalRef = useRef<HTMLDivElement>(null)
  // Generate a unique key for the individual modal
  const modalKey = useMemo(() => uuid(), [])

  // State of the modal page
  const isModalOpened = useSelector(state => selectModalStates(state)[page])
  // State of the individual modal component marked by the modalKey
  const isModalKeySet = useSelector(state => selectModalKey(modalKey)(state))
  // State of the modal
  const open = useMemo(
    () => isModalKeySet && isModalOpened,
    [isModalKeySet, isModalOpened]
  )

  // entry motion values and exit motion handling function for the modal
  const { motion, handleExitMotion } = useMotionDecider()

  const dispatch = useDispatch()
  useEffect(() => {
    // Open modal on mount (set state of the individual modal)
    dispatch(setModalKey(modalKey))
    // Clear all other modal keys on mount
    // This is needed to remove other modals that AnimatePresence didn't unmount
    clearModal(modalKey)
  }, [])

  // Get the navigation handler for the current path
  const { handleNavigation } = useDecideNavigationMethod()
  const location = useLocation()
  const handleClose = useCallback(
    (event: MouseEvent) => {
      event && event.preventDefault()
      // backgroundLocation is a previous path before modal was opened.
      // If backgroundLocation is not set, it means direct access via url.
      // And default(home) page should be rendered, hence the default value: { pathname: '/' }
      const { pathname } = findNonModalLocation(
        location?.state?.backgroundLocation
      ) || { pathname: '/' } // default background page

      // Handle exit motion based on previous path and current path
      handleExitMotion(pathname)

      // Handle navigation based on the current path and devices
      handleNavigation(pathname)
    },
    [handleNavigation, handleExitMotion, location]
  )

  // Handle when the user closes the modal by 'escape key' or 'close button'
  const onClose = useMemo(
    () => mergeEventListeners(disableNavigationWhileAnimating, handleClose),
    [handleClose]
  )

  // Handle navigation when the user navigates back/forth using browser buttons
  const onBrowserNavigation = useCallback(() => {
    // At the time of this function's invocation (when 'popstate' event is called),
    // The location is already changed. Hence, we get the current location from the window object
    // And use it as the 'to' parameter for the exit motion
    const to = window.location.pathname
    handleExitMotion(to)
  }, [handleExitMotion])

  // re-enable escape key to close modal
  useEnableEscapeKey(onClose)
  // handle exit motion when the user clicks backward/forward button
  useCallOnBrowserNavigation(onBrowserNavigation)
  // set modal open and close flag globally on mount
  useOpenModalOnMount(page)
  // add padding to account for scrollbar when it disappears
  useScrollbarPadding()

  return {
    open,
    onClose,
    motion,
    handleExitMotion,
    modalRef
  }
}
