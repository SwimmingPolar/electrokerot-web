import { useSelector } from 'app'
import { ModalClassName } from 'constant'
import { selectModalStates } from 'features'
import { useDeviceDetect, useNavigate } from 'hooks'
import { useCallback, useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import { NavLink, NavLinkProps, useLocation } from 'react-router-dom'

/*
    Link event functions
*/

// Merge multiple event handlers
type StopEventChain = () => void
export const mergeEventListeners =
  (...rest: any[]) =>
  (event: any) => {
    for (const fn of rest) {
      if (fn && typeof fn === 'function') {
        // decide if next event handler should be called
        let shouldStop = false
        // To stop calling merged event handlers,
        // we can call stopEventChain() passed as an second argument
        const stopEventChain = () => {
          shouldStop = true
        }

        fn(event, stopEventChain)

        if (shouldStop) {
          return
        }
      }
    }
  }
// Disable navigation to the same path
const disableSamePathNavigation = (from: string, to: string) => {
  if (from === to) {
    return (event: any) => {
      event.preventDefault()
    }
  }
}

// Loose focus after click
const removeFocusRingAfterClick = (event: MouseEvent) => {
  ;(event.currentTarget as LinkType).blur()
}

// Disable navigation while animating (not really accurate but just enough)
export const disableNavigationWhileAnimating = (
  event: MouseEvent,
  stopEventChain: StopEventChain
) => {
  const modals = Array.from(document.querySelectorAll(ModalClassName) || [])
  // If there are modals more than 2, it means modals are being animated
  const isAnimating = modals.length > 1

  if (isAnimating) {
    event.preventDefault()
    stopEventChain()
  }
}

// merge class names
const mergeClassNames = <T,>(className: T, classNames: string[]) => {
  if (!classNames || classNames?.length === 0)
    if (classNames.length === 0) {
      return className
    }
  if (typeof className === 'function') {
    return (props: { isActive: boolean; isPending: boolean }) => {
      const originalClassNames = className(props)
      return classNames
        .concat(originalClassNames || '')
        .join(' ')
        .trim()
    }
  }
  const originalClassName = className ? className.toString() : ''
  return classNames
    .join(' ')
    .concat(' ' + originalClassName)
    .trim()
}

/*
    Link Component
*/
type LinkType = HTMLButtonElement | HTMLAnchorElement
export const Link = (props: NavLinkProps) => {
  const to = props.to as string
  const { pathname: from } = useLocation()

  const onClick =
    disableSamePathNavigation(from, to) ||
    mergeEventListeners(removeFocusRingAfterClick, props?.onClick)

  return <NavLink {...props} onClick={onClick} tabIndex={0} />
}

/*
    NavLink Component
*/
/* event functions for NavLink component only */
type ModalLinkProps = NavLinkProps & {
  handleExitMotion?: (pathname: string) => void
}
export const ModalLink = ({ handleExitMotion, ...rest }: ModalLinkProps) => {
  const { isMobile } = useDeviceDetect()
  const navigate = useNavigate()

  const modalStates = useSelector(selectModalStates, shallowEqual)
  const isLoginPageOpened = useMemo(() => modalStates['/login'], [modalStates])

  // On desktop, when navigating between modal pages,
  // we do not push a new route. Instead, we move back and forth between the pages.
  // On mobile, we do not do that. Instead, we push a new route.
  const mightNavigateByDelta = useCallback(
    (from: string, to: string) => {
      // On mobile:
      if (isMobile) {
        return
      }

      // On desktop:
      const navigateByDelta = (delta: number) => (event: MouseEvent) => {
        event.preventDefault()
        navigate(delta)
      }
      const navigateByPath =
        (path: string, { replace = false }: { replace?: boolean }) =>
        (event: MouseEvent) => {
          event.preventDefault()
          navigate(path, {
            replace
          })
        }

      // When navigating FROM the page where the order is higher then the login page
      if (from === '/signup' && to === '/login') {
        if (isLoginPageOpened) {
          return navigateByDelta(-1)
        } else {
          // if login page is not opened, navigate by path
          // this means, direct access via url, so replace the current route
          // with the login page. that way login page's route will be the first route
          return navigateByPath('/login', { replace: true })
        }
      }
    },
    [isMobile, modalStates]
  )

  const location = useLocation()
  const { pathname: from } = location
  const to = rest.to as string

  const onClick =
    disableSamePathNavigation(from, to) ||
    mergeEventListeners(
      disableNavigationWhileAnimating,
      removeFocusRingAfterClick,
      () => handleExitMotion?.(to),
      mightNavigateByDelta(from, to),
      rest?.onClick
    )

  return (
    <NavLink
      {...rest}
      tabIndex={0}
      onClick={onClick}
      state={{
        backgroundLocation: location
      }}
    />
  )
}
