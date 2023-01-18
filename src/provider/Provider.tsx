import { Suspense } from 'react'
import { getTheme } from 'styles'
import { DeviceProvider } from './DeviceProvider'
import { StoreProvider } from './StoreProvider'
import { CustomThemeProvider } from './ThemeProvider'

type ProviderType = {
  children: JSX.Element
}

export const Provider = ({ children }: ProviderType) => (
  <Suspense fallback={<div>Suspense: Loading...</div>}>
    <StoreProvider>
      <DeviceProvider>
        <CustomThemeProvider theme={getTheme('light')}>
          {children}
        </CustomThemeProvider>
      </DeviceProvider>
    </StoreProvider>
  </Suspense>
)
