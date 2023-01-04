// adds callbacks to be dispatched when the user navigate backwards
export * from './useCallOnBrowserNavigation'
export { useCustomNavigate as useNavigate } from './useCallOnBrowserNavigation'
// detects devices
export * from './useDeviceDetect'
// see if the user is accessing the modal page directly via url
export * from './useIsDirectAccess'
// decides modal motion based on current and previous route
export * from './useMotionFinder'
// adds padding to right-side the element if the scrollbar disappears
export * from './useScrollbarPadding'
// Activate empty routing
export * from './useEmptyRoute'
// export all hooks from ModalLayout
export * from '../components/ModalLayout/hooks'

/*
 * list of hooks to apply globally
 */
// allows the user to navigate through elements by arrow key
import { useArrowMoveFocus } from './useArrowMoveFocus'
// determines if the user is accessing the modal page directly via url
import { useIsDirectAccess } from './useIsDirectAccess'
export const globalHooks = [useArrowMoveFocus, useIsDirectAccess]
