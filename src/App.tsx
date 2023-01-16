import { useHooks } from 'lib'
import { Provider } from 'provider'
import { AppRoutes } from 'routes'

const App = () => {
  useHooks()

  return (
    <Provider>
      <AppRoutes />
    </Provider>
  )
}

export default App
