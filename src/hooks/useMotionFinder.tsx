import { ModalPageOrders as PageOrders, ModalRoutes } from 'constant'
import { AnimationProps } from 'framer-motion'
import {
  didModalOpenedWithinApp,
  getLastPathname,
  useDeviceDetect
} from 'hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MotionConfig } from 'styles'

// When deciding the motion for the modal, we need to know
// if the modal is accessed directly via url. If so, we need to
// remove the 'initial' property from the motion config.
// didModalOpenedWithinApp() will return true if accessed directly via url
// but will keep returning true until the modal is unmounted.
// So, we need to use a closure to make sure that the function
// only returns true once.
const isDirectAccess = (() => {
  let executed = false
  return () => {
    if (executed) {
      return false
    }
    executed = true
    return !didModalOpenedWithinApp()
  }
})()

export const useMotionDecider = () => {
  const { isMobileFriendly } = useDeviceDetect()

  const location = useLocation()

  const currentPath = location.pathname
  const previousPath = getLastPathname()

  const initialMotion = useMemo(() => {
    let initialMotion = {} as AnimationProps
    const previousPageNumber = PageOrders[previousPath]
    const currentPageNumber = PageOrders[currentPath]

    // The user is accessing the modal page directly via url
    // or is coming from a non-modal page
    if (!ModalRoutes.includes(previousPath)) {
      // Copy pop-up motion config, so we can delete its 'exit' property
      Object.assign(initialMotion, MotionConfig['PopUpMotion'])
    }

    // The user is coming from a modal page (navigation between modal pages)
    else {
      Object.assign(initialMotion, MotionConfig['DefaultSlideMotion'])

      if (currentPageNumber < previousPageNumber) {
        Object.assign(initialMotion, MotionConfig['SlideFromLeft'])
      } else if (currentPageNumber > previousPageNumber) {
        Object.assign(initialMotion, MotionConfig['SlideFromRight'])
      }
    }

    // Delete 'exit' property, so the modal doesn't use 'exit' motion set on initial mount
    delete initialMotion.exit
    // Remove 'initial' property, so the modal doesn't use 'initial' motion set on initial mount
    // if the modal is accessed directly via url
    if (isDirectAccess()) {
      delete initialMotion.initial
    }

    // If the current device is mobile friendly, then remove all motions
    if (isMobileFriendly) {
      initialMotion = {}
    }

    return initialMotion
  }, [isMobileFriendly])

  // Use above initial motion as default motion
  const [motion, setMotion] = useState<AnimationProps>(initialMotion)

  const handleExitMotion = useCallback(
    (nextPath: string) => {
      if (isMobileFriendly) {
        return
      }

      const nextPageNumber = PageOrders[nextPath]
      const currentPageNumber = PageOrders[currentPath]

      const exitMotion = {} as AnimationProps
      // If next page is not modal page, use default pop-up motion
      if (!ModalRoutes.includes(nextPath)) {
        Object.assign(exitMotion, MotionConfig['PopUpMotion'])
      } else {
        Object.assign(exitMotion, MotionConfig['DefaultSlideMotion'])

        if (nextPageNumber < currentPageNumber) {
          Object.assign(exitMotion, MotionConfig['SlideToRight'])
        } else if (nextPageNumber > currentPageNumber) {
          Object.assign(exitMotion, MotionConfig['SlideToLeft'])
        }
      }

      // Remove entering motion and set exiting motion only
      setMotion({
        ...exitMotion,
        initial: false,
        animate: {}
      })

      return
    },
    [isMobileFriendly]
  )

  // Set new motion every time the viewport width changes
  useEffect(() => {
    setMotion(initialMotion)
  }, [isMobileFriendly])

  return {
    motion,
    handleExitMotion
  }
}
