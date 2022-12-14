import { store } from 'app'
import { Story } from '@storybook/react'
import { Provider } from 'react-redux'

export const withProvider = (Story: Story) => {
  return (
    <Provider store={store}>
      <Story />
    </Provider>
  )
}
