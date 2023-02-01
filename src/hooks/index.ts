// adds callbacks to be dispatched when the user navigate backwards
export * from './useCallOnBrowserNavigation'
export { useCustomNavigate as useNavigate } from './useCallOnBrowserNavigation'
// detects devices
export * from './useDeviceDetect'
// see if the user is accessing the modal page directly via url
export * from './useIsDirectAccess'
// decides modal motion based on current and previous route
export * from './useMotionFinder'
// compensate for the scrollbar width when it has to be hidden
export * from './useScrollbarLock'
// calculate the scrollbar width
export * from './useScrollbarWidth'
// Activate empty routing
export * from './useEmptyRoute'
// export all hooks from ModalLayout
export * from '../components/ModalLayout/hooks'
// debounce value
export * from './useDebouncedValue'
// detect mobile device
export * from './useDetectMobile'
//
export * from './useDeferredLocation'

/*
 * list of hooks to apply globally
 */
// allows the user to navigate through elements by arrow key
import { useMoveFocusByKeyboard } from './useMoveFocusByKeyboard'
// determines if the user is accessing the modal page directly via url
import { useIsDirectAccess } from './useIsDirectAccess'
export const globalHooks = [useMoveFocusByKeyboard, useIsDirectAccess]
