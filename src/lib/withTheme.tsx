import { Story } from '@storybook/react'
import { CustomThemeProvider } from 'provider'
import { getTheme } from 'styles'

export const withTheme = (Story: Story) => (
  <CustomThemeProvider theme={getTheme('light')}>
    {<Story />}
  </CustomThemeProvider>
)
