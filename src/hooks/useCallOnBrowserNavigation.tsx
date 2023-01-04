import { ModalRoutes } from 'constant'
import { useCallback, useEffect } from 'react'
import {
  // React Router Dom's Location type
  Location as RRDLocation,
  NavigateFunction,
  useLocation,
  useNavigate
} from 'react-router-dom'

const BACKWARD = -1
const FORWARD = 1

interface CustomWindow extends Window {
  location: Location & {
    order: number
    navigationByHook: boolean
  }
}

declare const window: CustomWindow

type Callback = (fromKey: string, toKey: string) => void
type HistoryMap = Map<
  string,
  {
    order: number
    pathname: string
  }
>

// order counter to track the order of the page
let order = 0
// track history by location key given by 'window' object's location object
const history: string[] = []
// map to store history information
const orderMap: HistoryMap = new Map()
// store recent path name
let lastPathname = ''

export const useRecordHistory = () => {
  const location = useLocation()
  const { key, pathname } = location

  useEffect(() => {
    // When mounting, set the current path as the last path
    lastPathname = pathname
    // If the key is not in the history,
    // it means that the user is navigating to a new page
    if (history.indexOf(key) === -1) {
      // Thus, push the key to the history
      history.push(key)

      // Store the order of the page, so when the user navigates back and forth
      // using the browser's buttons, we can determine the direction
      orderMap.set(key, {
        pathname,
        order: order++
      })
    }
  }, [pathname, key])
}

export const getLastPathname = () => lastPathname
export const getDeltaToNearestNonModalPage = (
  location: RRDLocation,
  delta = 0
): number => {
  const { pathname = '' } = location
  const { backgroundLocation } = location.state || {}

  if (ModalRoutes.includes(pathname)) {
    return getDeltaToNearestNonModalPage(backgroundLocation, delta + 1)
  } else {
    return delta
  }
}

// Let us know if the navigation is backward or forward
const isBackwardOrForward = (fromKey: string, toKey: string) => {
  const from = orderMap.get(fromKey)?.order as number
  const to = orderMap.get(toKey)?.order as number

  if (from > to) {
    return BACKWARD
  } else {
    return FORWARD
  }
}

type CreateHandler = {
  // Callback to invoke when the user navigates back or forward
  callback: Callback
  // Directional instruction to determine when to invoke the callback
  direction: number
  // Location key to compare with the current location key
  key: string
  // Whether to always trigger the callback no matter what the direction is
  alwaysTrigger?: boolean
}

type HookFactoryTypeOptions = {
  alwaysTrigger?: boolean
}

type HookFactoryType = (
  callback: Callback,
  { alwaysTrigger }?: HookFactoryTypeOptions
) => void

const hookFactory =
  (direction: number): HookFactoryType =>
  (callback, { alwaysTrigger } = {}) => {
    const location = useLocation()
    const { key } = location

    const handler = useCallback(
      (event: PopStateEvent) => {
        // If 'alwaysTrigger' is not set, and the popstate was triggered
        if (!alwaysTrigger) {
          // And the popstate event is triggered by the hook programmatically, we do not invoke handler.
          // This handler is only for the situation where the user is
          // using the browser's back and forward buttons
          if (window.location.navigationByHook) {
            return
          }
        }

        // get the location key from the event and the current location key
        const fromKey = key
        const toKey = event.state?.key

        // invoke callback by checking the direction
        if (isBackwardOrForward(fromKey, toKey) === direction) {
          callback(fromKey, toKey)
        }
      },
      [callback, location, key]
    )

    useEffect(() => {
      // bind the handler
      window.addEventListener('popstate', handler)

      return () => {
        // unbind the handler
        // window.removeEventListener('popstate', handler)

        // Reset the 'navigationByHook' flag to false when unmounting if any is set.
        // Debounce the reset process, if the call stack is not empty. This is needed
        // because 'AnimatePresence' postpones the unmounting of the component
        // until the animation is done.
        setTimeout(() => {
          window.location.navigationByHook = false
        }, 0)
      }
    }, [callback, location])
  }

// Simply call on backward or forward button click
export const useCallOnPopstate = (callback: Callback) => {
  useEffect(() => {
    window.addEventListener('popstate', callback as () => void)

    return () => {
      window.removeEventListener('popstate', callback as () => void)
    }
  }, [callback])
}

// Call on browser navigation (when url changes)
export const useCallOnBackward = hookFactory(BACKWARD)
export const useCallOnForward = hookFactory(FORWARD)
export const useCallOnBrowserNavigation: HookFactoryType = (
  callback,
  alwaysTrigger
) => {
  useCallOnBackward(callback, alwaysTrigger)
  useCallOnForward(callback, alwaysTrigger)
}

export const useCustomNavigate = (): NavigateFunction => {
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customNavigate = (...args: any) => {
    // set the navigationByHook flag to true whenever we navigate programmatically
    window.location.navigationByHook = true
    // call the original navigate function
    navigate.apply({}, args)
  }

  return customNavigate
}
