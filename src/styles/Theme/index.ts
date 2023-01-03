export const palette = {
  light: {
    primary: '#42494f',
    primary100: '#F0F2F5',
    primary200: '#d5d9dc',
    primary300: '#909aa2',
    primary400: '#717171',
    gray100: '#FCFCFC',
    gray200: '#F4F5F7',
    gray300: '#BFBFBF',
    gray400: '#A6A6A6',
    background: '#f0f4f7',
    surface: '#ffffff',
    black: '#000000',
    white: '#ffffff',
    blue100: '#EEFAFF',
    blue200: '#4492D4',
    blue300: '#0498EC'
  },
  dark: {}
}
export const theme = {
  fonts: {
    logo: 'Black Han Sans, sans-serif',
    primary: 'Arial, sans-serif',
    secondary: 'Nanum Gothic, sans-serif'
  }
}
export const getTheme = (mode: 'light' | 'dark') => ({
  ...theme,
  colors: mode === 'light' ? palette.light : palette.dark
})
