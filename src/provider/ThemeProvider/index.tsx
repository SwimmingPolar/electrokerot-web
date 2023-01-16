import {
  DefaultTheme,
  ThemeProvider,
  ThemeProviderProps
} from 'styled-components'

export const CustomThemeProvider = (
  props: ThemeProviderProps<DefaultTheme>
) => {
  return <ThemeProvider {...props}>{props.children}</ThemeProvider>
}
