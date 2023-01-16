import { Story } from '@storybook/react'
import { Provider } from 'provider'

export const withProvider = (Story: Story) => {
  return (
    <Provider>
      <Story />
    </Provider>
  )
}
