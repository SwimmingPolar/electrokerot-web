import { persistor, store } from 'app'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

type StoreProviderType = {
  children: JSX.Element
}

export const StoreProvider = ({ children }: StoreProviderType) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
)
