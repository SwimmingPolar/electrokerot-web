import { useLayoutEffect } from 'react'
import { ModalRoutes } from 'constant'

interface CustomWindow extends Window {
  _isDirectAccess: boolean
}

declare const window: CustomWindow

type AccessType = 'direct' | 'routing'

export const setAccessType = (accessType: AccessType) => {
  window._isDirectAccess = accessType === 'direct'
}

export const useIsDirectAccess = () => {
  useLayoutEffect(() => {
    const { pathname } = window.location
    if (ModalRoutes.includes(pathname)) {
      setAccessType('direct')
    } else {
      setAccessType('routing')
    }
  }, [])
}

export const useUnsetIsDirectAccess = () => {
  useLayoutEffect(() => {
    return () => {
      setAccessType('routing')
    }
  }, [])
}

export const didModalOpenedWithinApp = () => !window._isDirectAccess
