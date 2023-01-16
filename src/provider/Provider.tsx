import { getTheme } from 'styles'
import { DeviceProvider } from './DeviceProvider'
import { StoreProvider } from './StoreProvider'
import { CustomThemeProvider } from './ThemeProvider'

type ProviderType = {
  children: JSX.Element
}

export const Provider = ({ children }: ProviderType) => (
  <StoreProvider>
    <DeviceProvider>
      <CustomThemeProvider theme={getTheme('light')}>
        {children}
      </CustomThemeProvider>
    </DeviceProvider>
  </StoreProvider>
)
