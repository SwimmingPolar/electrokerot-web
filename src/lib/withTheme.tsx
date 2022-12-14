import { Story } from '@storybook/react'
import { ThemeProvider } from 'provider'
import { getTheme } from 'styles'

export const withTheme = (Story: Story) => (
  <ThemeProvider theme={getTheme('light')}>{<Story />}</ThemeProvider>
)
