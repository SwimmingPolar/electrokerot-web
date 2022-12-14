import { Story } from '@storybook/react'
import { DummyDiv, ModalBackdrop, PageLayout } from 'components'
import { ModalRoutes } from 'constant'
import { AnimatePresence, motion } from 'framer-motion'
import { useDeviceDetect, useRecordHistory } from 'hooks'
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import { findNonModalLocation } from 'routes'

type RouterOption = Pick<Parameters<typeof createMemoryRouter>, '1'>[1]
type WithRouterProps = {
  path: string
  options?: RouterOption
}

export const withRouter = ({ path, options }: WithRouterProps) => {
  return function withRouterDecorator(Story: Story) {
    return (
      <MemoryRouter {...options}>
        <Routes>
          <Route path={path} element={<Story />} />
          <Route path="*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    )
  }
}

// pathname should be a path to default route such as Home or App
const defaultBackgroundLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default'
}

type RouterWrapperProps = {
  path: string
  Story: Story
  content: React.ReactNode
}

const RouterWrapper = ({ path, Story, content }: RouterWrapperProps) => {
  // save navigation order to know when user is navigating backward or forward
  useRecordHistory()

  // Remove modal backdrop styles based on device
  const { isMobileFriendly } = useDeviceDetect()

  const location = useLocation()
  const { state, pathname, key } = location || {}
  let { backgroundLocation } = state || {}

  backgroundLocation = findNonModalLocation(backgroundLocation)

  if (!backgroundLocation && ModalRoutes.includes(pathname)) {
    backgroundLocation = defaultBackgroundLocation
    location.state = { backgroundLocation }
  }

  // Make sure new route is a valid modal route and
  // is a modal route that is currently being displayed
  // or else redirect to default route.
  const showModal = ModalRoutes.includes(pathname) && path === pathname

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route
          path="*"
          element={<PageLayout fullWidth={true}>{content}</PageLayout>}
        />
      </Routes>

      <AnimatePresence>
        {showModal && (
          <motion.div key={pathname + '-' + key}>
            {!isMobileFriendly && <DummyDiv />}
            <Routes location={location}>
              <Route path={path} element={<Story />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial>
        {showModal && !isMobileFriendly && <ModalBackdrop />}
      </AnimatePresence>
    </>
  )
}

type WithModalRouterProps = {
  path: string
  options?: RouterOption
  content?: React.ReactNode
}
export const withModalRouter = ({
  path,
  options,
  content
}: WithModalRouterProps) => {
  return function withRouterDecorator(Story: Story) {
    return (
      <MemoryRouter {...options}>
        <RouterWrapper path={path} Story={Story} content={content} />
      </MemoryRouter>
    )
  }
}
