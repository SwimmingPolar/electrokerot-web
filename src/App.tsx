import { store } from 'app/store'
import { useHooks } from 'lib'
import { ThemeProvider } from 'provider'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { RoutesProvider } from 'routes'
import { getTheme } from 'styles'

const App = () => {
  useHooks()

  return (
    <Provider store={store}>
      <ThemeProvider theme={getTheme('light')}>
        <BrowserRouter>
          <RoutesProvider />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App
