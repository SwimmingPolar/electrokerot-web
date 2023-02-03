import { Suspense } from 'react'
import { getTheme } from 'styles'
import { DeviceProvider } from './DeviceProvider'
import { StoreProvider } from './StoreProvider'
import { CustomThemeProvider } from './ThemeProvider'
import { CustomProvider } from './CustomProvider'

type ProviderType = {
  children: JSX.Element
}

export const Provider = ({ children }: ProviderType) => (
  <Suspense
    fallback={
      <div>
        <h1>Loading...</h1>
      </div>
    }
  >
    <StoreProvider>
      <DeviceProvider>
        <CustomThemeProvider theme={getTheme('light')}>
          <CustomProvider>{children}</CustomProvider>
        </CustomThemeProvider>
      </DeviceProvider>
    </StoreProvider>
  </Suspense>
)
