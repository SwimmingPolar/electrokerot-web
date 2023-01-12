import { DummyDiv, ModalBackdrop } from 'components'
import { ModalRoutes } from 'constant'
import { AnimatePresence, motion } from 'framer-motion'
import { useDeviceDetect, useRecordHistory } from 'hooks'
import {
  BuildPage,
  LoginPage,
  PartListPage,
  PartsMenuPage,
  SignupPage
} from 'pages'
import {
  Location,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import { v4 as uuid } from 'uuid'

// pathname should be a path to default route such as Home or App
const defaultBackgroundLocation = {
  pathname: '/parts',
  search: '',
  hash: '',
  state: null,
  key: 'default'
}

export const findNonModalLocation = (
  backgroundLocation: Location | undefined
): Location | undefined => {
  const { pathname = '' } = backgroundLocation || {}
  const nextBackgroundLocation = backgroundLocation?.state?.backgroundLocation

  if (ModalRoutes.includes(pathname)) {
    return findNonModalLocation(nextBackgroundLocation)
  } else {
    return backgroundLocation
  }
}

export const RoutesProvider = () => {
  // record the history of the user's navigation
  useRecordHistory()

  // Remove modal backdrop styles based on device
  const { isMobileFriendly } = useDeviceDetect()

  const location = useLocation()
  const { state, pathname, key } = location || {}
  let { backgroundLocation } = state || {}

  // If the user is coming from modal page, set backgroundLocation to the
  // modal page's nearest non-modal background location by climbing up the tree
  backgroundLocation = findNonModalLocation(backgroundLocation)

  // If backgroundLocation is not set, set it to defaultBackgroundLocation.
  // This probably means that the user is accessing the modal page directly via url.
  if (!backgroundLocation && ModalRoutes.includes(pathname)) {
    backgroundLocation = defaultBackgroundLocation
    location.state = { backgroundLocation }
  }

  const showModal = ModalRoutes.includes(pathname)

  return (
    <>
      {/* @Issue: AnimatePresence is partially broken with the current React version 18
                  Due to this buggy behavior, DummyDiv and outer motion.div are required,
                  and AnimatePresence doesn't remove exiting node even after animation finishes
                  Countermeasure: the key point is to not allow the user to close the modals when they are animating
                  1 Disable the default feature of mui modal that closes the modal
                  when user press 'esc'. (ModalLayout)
                  2. Add custom 'esc' feature that closes the modal only when the modal is not animating. (ModalLayout)
                  3. Disable navigation between modals when the modal is animating.  */}
      <AnimatePresence>
        <Routes location={backgroundLocation || location}>
          <Route path="/" element={<Navigate to="/parts" replace={true} />} />
          <Route path="/parts" element={<PartsMenuPage />} />
          <Route path="/parts/:category" element={<PartListPage />} />
          <Route path="/builds" element={<BuildPage />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
        {showModal && (
          // @Important: key must be added to prevent animation from being skipped.
          // If the user navigate from login page (any modal page) to another modal page,
          // before it gets unmounted after the animation finishes, and then navigate
          // back to the first modal page, the second component's entry animation will be skipped.
          // This is due to component key being the same, thus the component will have the same state and batch cycle.
          // It will cause react to skip new state being created and the result returned from 'setMotion' batched from
          // the first modal page's exit handler will be used for the second entry to the first page's entry motion,
          // causing the page to have opacity of 0
          <motion.div key={pathname + '-' + key + '-' + uuid()}>
            {/* dummy motion div is required for framer-motion's incompatible with react 18 */}
            {!isMobileFriendly && <DummyDiv />}
            <Routes location={location}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>

      {/* separate backdrop to avoid transparent backdrop overlapping */}
      <AnimatePresence>
        {/* {showModal && !isMobileFriendly && <ModalBackdrop />} */}
        {showModal && <ModalBackdrop />}
      </AnimatePresence>
    </>
  )
}
