import { DeviceDetectContextProvider } from 'hooks'
import {
  DefaultTheme,
  ThemeProvider,
  ThemeProviderProps
} from 'styled-components'

export const customThemeProvider = (
  props: ThemeProviderProps<DefaultTheme>
) => {
  return (
    <DeviceDetectContextProvider>
      <ThemeProvider {...props}>{props.children}</ThemeProvider>
    </DeviceDetectContextProvider>
  )
}
