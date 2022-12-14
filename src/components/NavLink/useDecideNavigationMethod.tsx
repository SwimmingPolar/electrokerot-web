import { useSelector } from 'app'
import { selectModalStates } from 'features'
import {
  didModalOpenedWithinApp,
  getDeltaToNearestNonModalPage,
  useDeviceDetect
} from 'hooks'
import { useCallback, useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'hooks'

/*
Desktop:
Modal access within app:
----------------------------------------------
user navigation:        / -> /login -> /signup -> /
                                   back(-2)
actual router history:  / -> /login -> /signup
                      current
----------------------------------------------
user navigation:        / -> /login -> /
                             back(-1)
actual router history:  / -> /login
                      current
----------------------------------------------



Modal access directly via url:
----------------------------------------------
user navigation:        /login -> /signup -> /
                                   replace
actual router history:  /login -> /
                               current
----------------------------------------------
user navigation:        /login -> /signup -> /login -> /
                          BACK and FORTH by NavLink component
actual router history:  /login -> /
                               current
----------------------------------------------
user navigation:        /login -> /

actual router history:  /login -> /
                               current
----------------------------------------------
user navigation:        /signup -> /

actual router history:  /
                     current
----------------------------------------------
user navigation:        /signup -> /login -> /signup -> /

actual router history:  /login -> /
                              current



Mobile: sync the user navigation history with the actual router history
----------------------------------------------
user navigation:        / -> /login -> /signup -> /
actual router history:  / -> /login -> /signup -> /
----------------------------------------------
user navigation:        / -> /login -> /
actual router history:  / -> /login -> /
*/

export const useDecideNavigationMethod = () => {
  const { isMobileFriendly } = useDeviceDetect()
  const isDesktopFriendly = !isMobileFriendly
  const isModalOpenedWithinApp = useMemo(didModalOpenedWithinApp, [
    didModalOpenedWithinApp()
  ])
  const modalStates = useSelector(selectModalStates, shallowEqual)
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const handleNavigation = useCallback(
    (newPathname: string) => {
      // routing for DESKTOP
      if (isDesktopFriendly) {
        // If modal was opened within app
        if (isModalOpenedWithinApp) {
          const navigationDelta = getDeltaToNearestNonModalPage(location)
          return navigate(-navigationDelta)
        }
        // If modal was opened via direct access,
        // which means there may be no previous path to go back to
        else {
          // If the current path is signup page,
          // then go to new path replacing the current path
          // so signup page is not saved in history
          if (pathname === '/signup') {
            return navigate(newPathname, {
              replace: true
            })
          }
          // If the current path is not signup page,
          // then go to new path creating a new history.
          // So, the current path is the first history (possibly login page).
          else {
            return navigate(newPathname)
          }
        }
      }

      // routing for MOBILE DEVICES
      else {
        // just create a new history
        return navigate(newPathname)
      }
    },
    [isDesktopFriendly, modalStates, isModalOpenedWithinApp]
  )

  return { handleNavigation }
}
