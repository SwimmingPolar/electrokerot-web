import { useLayoutEffect, useState } from 'react'

interface CustomWindow extends Window {
  _isDirectAccess: string
}

declare const window: CustomWindow

const AccessConfirmationPhrase = 'accessed_within_app'

export const setAccessType = () => {
  // Any value that is not undefined will do.
  window._isDirectAccess = AccessConfirmationPhrase
}

// Should use this hook only once at the very root of the app
// On initial render, isDirect will be 'true', then it will be 'false'
// If the function should be called only once then do not put
// 'isDirect' in the dependency array
export const useIsDirectAccess = () => {
  const [isDirect, setIsDirect] = useState(window._isDirectAccess === undefined)

  useLayoutEffect(() => {
    setAccessType()
    setIsDirect(false)
  }, [])

  return isDirect
}
