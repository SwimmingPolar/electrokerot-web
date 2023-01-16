import { useEffect, useState } from 'react'

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

  useEffect(() => {
    // @Issue: This is a hack to make sure that the state is updated
    // 'after' the initial redux-persist rehydration. Without redux-persist,
    // we don't need this because the state update occurs as it should and as it looks.
    // But if we use redux-persist, the state update occurs before the
    // rehydration is done.

    setTimeout(() => {
      setAccessType()
      setIsDirect(false)
    }, 0)
  }, [])

  return isDirect
}
