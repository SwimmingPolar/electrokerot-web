import { useLayoutEffect } from 'react'

interface CustomWindow extends Window {
  _isDirectAccess: string
}

declare const window: CustomWindow

const AccessConfirmationPhrase = 'accessing_within_app'

export const setAccessType = () => {
  // Any string will do.
  // The catch is that we need to check if this variable is undefined or not
  // If undefined, then the modal is accessed directly via url
  window._isDirectAccess = AccessConfirmationPhrase
}

export const useIsDirectAccess = () => {
  useLayoutEffect(() => {
    return () => {
      setAccessType()
    }
  }, [])
}

export const didModalOpenedWithinApp = () =>
  !(window._isDirectAccess === undefined)
